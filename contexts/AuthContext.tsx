
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Platform } from "react-native";
import { authClient } from "@/lib/auth";

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

function openOAuthPopup(provider: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const popupUrl = `${window.location.origin}/auth-popup?provider=${provider}`;
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    console.log("[AuthContext] Opening OAuth popup for provider:", provider);
    console.log("[AuthContext] Popup URL:", popupUrl);

    const popup = window.open(
      popupUrl,
      "oauth-popup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup) {
      console.error("[AuthContext] Failed to open popup window");
      reject(new Error("Failed to open popup. Please allow popups."));
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        console.warn("[AuthContext] Received message from different origin:", event.origin);
        return;
      }

      console.log("[AuthContext] Received message from popup:", event.data);

      if (event.data?.type === "oauth-success" && event.data?.user) {
        console.log("[AuthContext] OAuth success, user:", event.data.user.email);
        window.removeEventListener("message", handleMessage);
        clearInterval(checkClosed);
        resolve(event.data.user);
      } else if (event.data?.type === "oauth-error") {
        console.error("[AuthContext] OAuth error from popup:", event.data.error);
        window.removeEventListener("message", handleMessage);
        clearInterval(checkClosed);
        reject(new Error(event.data.error || "OAuth failed"));
      }
    };

    window.addEventListener("message", handleMessage);

    // Check if popup was closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        console.log("[AuthContext] Popup was closed by user");
        clearInterval(checkClosed);
        window.removeEventListener("message", handleMessage);
        reject(new Error("Authentication cancelled"));
      }
    }, 500);
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      console.log("[AuthContext] Fetching user session...");
      const session = await authClient.getSession();
      
      if (session?.user) {
        console.log("[AuthContext] User session found:", session.user.email);
        setUser(session.user as User);
      } else {
        console.log("[AuthContext] No user session found");
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthContext] Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Signing in with email:", email);
      await authClient.signIn.email({ email, password });
      await fetchUser();
    } catch (error) {
      console.error("[AuthContext] Email sign in failed:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name?: string) => {
    try {
      console.log("[AuthContext] Signing up with email:", email);
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/profile",
      });
      await fetchUser();
    } catch (error) {
      console.error("[AuthContext] Email sign up failed:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("[AuthContext] Starting Google sign in, platform:", Platform.OS);
      
      if (Platform.OS === "web") {
        const userData = await openOAuthPopup("google");
        console.log("[AuthContext] Got user data from popup:", userData.email);
        setUser(userData);
        
        // Fetch full session to ensure everything is synced
        await fetchUser();
      } else {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/profile",
        });
        await fetchUser();
      }
    } catch (error) {
      console.error("[AuthContext] Google sign in failed:", error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      console.log("[AuthContext] Starting Apple sign in, platform:", Platform.OS);
      
      if (Platform.OS === "web") {
        const userData = await openOAuthPopup("apple");
        console.log("[AuthContext] Got user data from popup:", userData.email);
        setUser(userData);
        
        // Fetch full session to ensure everything is synced
        await fetchUser();
      } else {
        await authClient.signIn.social({
          provider: "apple",
          callbackURL: "/profile",
        });
        await fetchUser();
      }
    } catch (error) {
      console.error("[AuthContext] Apple sign in failed:", error);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      console.log("[AuthContext] Starting GitHub sign in, platform:", Platform.OS);
      
      if (Platform.OS === "web") {
        const userData = await openOAuthPopup("github");
        console.log("[AuthContext] Got user data from popup:", userData.email);
        setUser(userData);
        
        // Fetch full session to ensure everything is synced
        await fetchUser();
      } else {
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/profile",
        });
        await fetchUser();
      }
    } catch (error) {
      console.error("[AuthContext] GitHub sign in failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("[AuthContext] Signing out");
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("[AuthContext] Sign out failed:", error);
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
