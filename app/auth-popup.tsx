
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { authClient } from "@/lib/auth";
import { colors } from "@/styles/commonStyles";

export default function AuthPopup() {
  const params = useLocalSearchParams<{ provider?: string; code?: string; state?: string }>();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Initializing...");

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleOAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasOAuthCallback = urlParams.has('code') || urlParams.has('error');

        if (hasOAuthCallback) {
          // We're in the callback phase - OAuth provider redirected back to us
          setStatus("Completing authentication...");
          console.log("OAuth callback detected, getting session...");
          
          // Wait a moment for Better Auth to process the callback
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get the session
          const session = await authClient.getSession();
          console.log("Session retrieved:", session);
          
          if (session?.user && window.opener) {
            console.log("Sending user data to parent window");
            // Send user data to parent window
            window.opener.postMessage(
              {
                type: "oauth-success",
                user: session.user,
              },
              window.location.origin
            );
            
            setStatus("Success! Closing window...");
            setTimeout(() => window.close(), 500);
          } else {
            throw new Error("Authentication failed - no user session");
          }
        } else {
          // We're in the initial phase - need to start OAuth flow
          const provider = params.provider;
          
          if (!provider) {
            throw new Error("No provider specified");
          }

          setStatus(`Redirecting to ${provider}...`);
          console.log("Starting OAuth flow for provider:", provider);
          
          // Initiate OAuth flow - this will redirect to the provider
          await authClient.signIn.social({
            provider: provider as any,
            callbackURL: window.location.href.split('?')[0], // Use current URL without params as callback
          });
        }
      } catch (err: any) {
        console.error("OAuth error:", err);
        setError(err.message || "Authentication failed");
        
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "oauth-error",
              error: err.message || "Authentication failed",
            },
            window.location.origin
          );
        }
        
        // Close popup after showing error briefly
        setTimeout(() => window.close(), 2000);
      }
    };

    handleOAuth();
  }, [params.provider]);

  return (
    <View style={styles.container}>
      {error ? (
        <>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.subText}>This window will close automatically...</Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.text}>{status}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
