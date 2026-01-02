
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { authClient } from "@/lib/auth";
import { colors } from "@/styles/commonStyles";

export default function AuthPopup() {
  const params = useLocalSearchParams<{ provider?: string; error?: string }>();

  useEffect(() => {
    // Only run on web platform
    if (Platform.OS !== "web") {
      console.log("Auth popup is web-only");
      return;
    }

    const handleOAuthCallback = async () => {
      console.log("Auth popup loaded with params:", params);

      try {
        // Check if there's an error in the URL
        if (params.error) {
          sendMessageToParent("error", params.error);
          return;
        }

        // If provider is specified, this is the initial redirect
        // The OAuth provider will redirect back to this same URL with auth codes
        if (params.provider) {
          console.log("Initiating OAuth flow for provider:", params.provider);
          
          // Initiate OAuth flow - this will redirect to the provider
          await authClient.signIn.social({
            provider: params.provider as any,
            callbackURL: window.location.origin + "/auth-popup",
          });
        } else {
          // This is the callback from the OAuth provider
          // Better Auth should automatically handle the callback
          console.log("Processing OAuth callback...");
          
          // Wait a bit for Better Auth to process the callback
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get the session to verify authentication succeeded
          const session = await authClient.getSession();
          console.log("Session after OAuth:", session);
          
          if (session?.user) {
            // Send success message to parent window
            sendMessageToParent("success", session.user);
            
            // Close popup after short delay
            setTimeout(() => {
              window.close();
            }, 500);
          } else {
            sendMessageToParent("error", "Failed to get session after authentication");
          }
        }
      } catch (error: any) {
        console.error("OAuth error in popup:", error);
        sendMessageToParent("error", error.message || "Authentication failed");
      }
    };

    handleOAuthCallback();
  }, [params]);

  const sendMessageToParent = (type: "success" | "error", data: any) => {
    if (typeof window !== "undefined" && window.opener) {
      console.log("Sending message to parent:", type, data);
      window.opener.postMessage(
        {
          type: type === "success" ? "oauth-success" : "oauth-error",
          [type === "success" ? "user" : "error"]: data,
        },
        window.location.origin
      );
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>
        {params.provider 
          ? `Redirecting to ${params.provider}...` 
          : "Completing authentication..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
