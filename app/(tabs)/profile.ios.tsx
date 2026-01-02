
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProfileScreen() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, signOut } = useAuth();

  const settingsOptions = [
    {
      id: "1",
      title: "Account Settings",
      icon: "settings",
      color: colors.primary,
    },
    {
      id: "2",
      title: "Notifications",
      icon: "notifications",
      color: colors.secondary,
    },
    {
      id: "3",
      title: "Connected Platforms",
      icon: "link",
      color: colors.accent,
    },
    {
      id: "4",
      title: "Data & Privacy",
      icon: "lock",
      color: colors.success,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, colors.secondary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <View style={styles.avatarContainer}>
              <IconSymbol
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={48}
                color={colors.text}
              />
            </View>
          </LinearGradient>
          <Text style={styles.userName}>{user?.name || user?.email || "User"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Platforms</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>89%</Text>
            <Text style={styles.statLabel}>Avg Growth</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.settingCard}
              onPress={() => {
                // TODO: Backend Integration - Navigate to settings screen
                console.log(`Setting tapped: ${option.title}`);
              }}
            >
              <View style={[styles.settingIcon, { backgroundColor: option.color + "20" }]}>
                <IconSymbol
                  ios_icon_name={option.icon}
                  android_material_icon_name={option.icon}
                  size={24}
                  color={option.color}
                />
              </View>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="arrow-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={async () => {
            try {
              await signOut();
              console.log("User signed out successfully");
            } catch (error) {
              console.error("Error signing out:", error);
            }
          }}
        >
          <IconSymbol
            ios_icon_name="rectangle.portrait.and.arrow.right"
            android_material_icon_name="logout"
            size={20}
            color={colors.error}
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    marginBottom: 16,
  },
  avatarContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.error + "40",
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
  },
});
