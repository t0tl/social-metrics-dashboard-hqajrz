
/**
 * Authentication Context Template
 *
 * Provides authentication state and methods throughout the app.
 * Supports:
 * - Email/password authentication
 * - Social auth (Google, Apple, GitHub) with popup flow for web
 * - Session management
 * - User state
 *
 * Usage:
 * 1. Update imports to match your auth-client.ts path
 * 2. Wrap your app with <AuthProvider>
 * 3. Use useAuth() hook in components to access auth methods
 * 4. Customize user type and auth methods as needed
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Platform } from "react-native";
import { authClient, storeWebBearerToken } from "@/lib/auth";

// User type - customize based on your backend
interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Opens OAuth popup for web-based social authentication
 * Returns a promise that resolves with the user data
 */
function openOAuthPopup(provider: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const popupUrl = `${window.location.origin}/auth-popup?provider=${provider}`;
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    console.log("Opening OAuth popup for provider:", provider);

    const popup = window.open(
      popupUrl,
      "oauth-popup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup) {
      reject(new Error("Failed to open popup. Please allow popups for this site."));
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from our popup
      if (event.origin !== window.location.origin) {
        console.log("Ignoring message from different origin:", event.origin);
        return;
      }

      console.log("Received message from popup:", event.data);

      if (event.data?.type === "oauth-success" && event.data?.user) {
        window.removeEventListener("message", handleMessage);
        clearInterval(checkClosed);
        popup.close();
        resolve(event.data.user);
      } else if (event.data?.type === "oauth-error") {
        window.removeEventListener("message", handleMessage);
        clearInterval(checkClosed);
        popup.close();
        reject(new Error(event.data.error || "OAuth authentication failed"));
      }
    };

    window.addEventListener("message", handleMessage);

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener("message", handleMessage);
        reject(new Error("Authentication cancelled - popup was closed"));
      }
    }, 500);
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const session = await authClient.getSession();
      console.log("Fetched session:", session);
      if (session?.user) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await authClient.signIn.email({ email, password });
      await fetchUser();
    } catch (error) {
      console.error("Email sign in failed:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name?: string) => {
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/profile",
      });
      await fetchUser();
    } catch (error) {
      console.error("Email sign up failed:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign in, platform:", Platform.OS);
      
      if (Platform.OS === "web") {
        // Web: Use popup flow to avoid cross-origin issues
        console.log("Using popup flow for Google sign in");
        const userData = await openOAuthPopup("google");
        console.log("OAuth popup completed with user:", userData);
        
        // Fetch the updated session
        await fetchUser();
      } else {
        // Native: Use deep linking (handled by Better Auth)
        console.log("Using deep linking for Google sign in");
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/profile",
        });
        await fetchUser();
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      console.log("Starting Apple sign in, platform:", Platform.OS);
      
      if (Platform.OS === "web") {
        // Web: Use popup flow
        console.log("Using popup flow for Apple sign in");
        const userData = await openOAuthPopup("apple");
        console.log("OAuth popup completed with user:", userData);
        
        // Fetch the updated session
        await fetchUser();
      } else {
        // Native: Use deep linking
        console.log("Using deep linking for Apple sign in");
        await authClient.signIn.social({
          provider: "apple",
          callbackURL: "/profile",
        });
        await fetchUser();
      }
    } catch (error) {
      console.error("Apple sign in failed:", error);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      console.log("Starting GitHub sign in, platform:", Platform.OS);
      
      if (Platform.OS === "web") {
        // Web: Use popup flow
        console.log("Using popup flow for GitHub sign in");
        const userData = await openOAuthPopup("github");
        console.log("OAuth popup completed with user:", userData);
        
        // Fetch the updated session
        await fetchUser();
      } else {
        // Native: Use deep linking
        console.log("Using deep linking for GitHub sign in");
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/profile",
        });
        await fetchUser();
      }
    } catch (error) {
      console.error("GitHub sign in failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
        signInWithGitHub,
        signOut,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
