
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authClient } from "@/lib/auth";

export default function AuthPopup() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const provider = params.provider as string;
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    // Only run on web
    if (Platform.OS !== "web") {
      console.log("[auth-popup] Not on web, redirecting to sign-in");
      router.replace("/sign-in");
      return;
    }

    const handleOAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasCode = urlParams.has("code");
        const hasState = urlParams.has("state");
        const hasError = urlParams.has("error");

        console.log("[auth-popup] URL params:", {
          provider,
          hasCode,
          hasState,
          hasError,
          url: window.location.href,
        });

        // Handle OAuth errors from provider
        if (hasError) {
          const error = urlParams.get("error");
          const errorDescription = urlParams.get("error_description");
          console.error("[auth-popup] OAuth provider error:", error, errorDescription);
          
          if (window.opener) {
            window.opener.postMessage(
              { 
                type: "oauth-error", 
                error: errorDescription || error || "OAuth failed" 
              },
              window.location.origin
            );
          }
          window.close();
          return;
        }

        // This is the callback from OAuth provider
        if (hasCode || hasState) {
          console.log("[auth-popup] Detected OAuth callback, waiting for session...");
          setStatus("Completing authentication...");

          // Wait a bit for BetterAuth to process the callback
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Try to get the session multiple times with delays
          let session = null;
          let attempts = 0;
          const maxAttempts = 5;

          while (!session && attempts < maxAttempts) {
            attempts++;
            console.log(`[auth-popup] Attempt ${attempts}/${maxAttempts} to get session`);
            
            try {
              session = await authClient.getSession();
              console.log("[auth-popup] Session result:", session ? "Found" : "Not found");
            } catch (err) {
              console.error("[auth-popup] Error getting session:", err);
            }

            if (!session && attempts < maxAttempts) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }

          if (session?.user) {
            console.log("[auth-popup] Successfully got user session:", session.user.email);
            
            if (window.opener) {
              window.opener.postMessage(
                { type: "oauth-success", user: session.user },
                window.location.origin
              );
              console.log("[auth-popup] Sent success message to parent, closing popup");
              
              // Small delay before closing to ensure message is received
              await new Promise(resolve => setTimeout(resolve, 100));
              window.close();
            } else {
              console.error("[auth-popup] No window.opener found");
              setStatus("Authentication successful! You can close this window.");
            }
          } else {
            throw new Error("No session found after OAuth callback");
          }
        } 
        // Initial redirect to OAuth provider
        else if (provider) {
          console.log("[auth-popup] Starting OAuth flow for provider:", provider);
          setStatus(`Redirecting to ${provider}...`);
          
          await authClient.signIn.social({
            provider: provider as any,
            callbackURL: `${window.location.origin}/auth-popup?provider=${provider}`,
          });
        } 
        // No provider and no callback params
        else {
          throw new Error("No provider specified and no OAuth callback detected");
        }
      } catch (error) {
        console.error("[auth-popup] OAuth error:", error);
        setStatus("Authentication failed");
        
        if (window.opener) {
          window.opener.postMessage(
            { 
              type: "oauth-error", 
              error: error instanceof Error ? error.message : "OAuth failed" 
            },
            window.location.origin
          );
          
          // Small delay before closing
          await new Promise(resolve => setTimeout(resolve, 500));
          window.close();
        } else {
          setStatus("Error: " + (error instanceof Error ? error.message : "OAuth failed"));
        }
      }
    };

    handleOAuth();
  }, [provider, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
