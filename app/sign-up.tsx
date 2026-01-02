
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signUpWithEmail(email, password, name);
      console.log("Sign up successful");
      router.replace("/(tabs)/(home)/");
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      console.log("Google sign in successful");
      router.replace("/(tabs)/(home)/");
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithApple();
      console.log("Apple sign in successful");
      router.replace("/(tabs)/(home)/");
    } catch (err: any) {
      console.error("Apple sign in error:", err);
      setError(err.message || "Failed to sign in with Apple");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, colors.secondary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="bar-chart"
              size={48}
              color={colors.background}
            />
          </LinearGradient>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start tracking your social media growth</Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <IconSymbol
              ios_icon_name="exclamationmark.triangle.fill"
              android_material_icon_name="error"
              size={20}
              color={colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <IconSymbol
            ios_icon_name="person.fill"
            android_material_icon_name="person"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <IconSymbol
            ios_icon_name="envelope.fill"
            android_material_icon_name="email"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpButton, loading && styles.buttonDisabled]}
          onPress={handleEmailSignUp}
          disabled={loading}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Sign In Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <IconSymbol
              ios_icon_name="g.circle.fill"
              android_material_icon_name="login"
              size={24}
              color={colors.text}
            />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <IconSymbol
                ios_icon_name="apple.logo"
                android_material_icon_name="login"
                size={24}
                color={colors.text}
              />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 60 : 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.error + "20",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 24,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
