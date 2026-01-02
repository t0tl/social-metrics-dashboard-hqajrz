
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const { width } = Dimensions.get("window");

interface Metric {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  platform: string;
}

interface TrendData {
  date: string;
  value: number;
}

type Platform = "all" | "instagram" | "twitter" | "tiktok" | "linkedin";

export default function HomeScreen() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("all");
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: "1",
      label: "Followers",
      value: "24.5K",
      change: 12.5,
      icon: "person",
      color: colors.primary,
    },
    {
      id: "2",
      label: "Engagement",
      value: "8.2%",
      change: 3.2,
      icon: "favorite",
      color: colors.secondary,
    },
    {
      id: "3",
      label: "Reach",
      value: "156K",
      change: -2.1,
      icon: "visibility",
      color: colors.accent,
    },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Reach 30K Followers",
      current: 24500,
      target: 30000,
      platform: "Instagram",
    },
    {
      id: "2",
      title: "10% Engagement Rate",
      current: 8.2,
      target: 10,
      platform: "All Platforms",
    },
  ]);

  const [trendData, setTrendData] = useState<number[]>([
    20000, 21500, 22000, 22800, 23200, 23800, 24500,
  ]);

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // TODO: Backend Integration - Fetch initial data on mount
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Backend Integration - Fetch metrics from GET /api/metrics/summary
      // const metricsResponse = await fetch(`${API_URL}/api/metrics/summary`);
      // const metricsData = await metricsResponse.json();
      // setMetrics(metricsData);

      // TODO: Backend Integration - Fetch goals from GET /api/goals
      // const goalsResponse = await fetch(`${API_URL}/api/goals`);
      // const goalsData = await goalsResponse.json();
      // setGoals(goalsData);

      // TODO: Backend Integration - Fetch trend data from GET /api/analytics/trends
      // const trendsResponse = await fetch(`${API_URL}/api/analytics/trends?platform=${selectedPlatform}`);
      // const trendsData = await trendsResponse.json();
      // setTrendData(trendsData.map(item => item.value));

      console.log("Dashboard data fetched successfully");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const platforms: { id: Platform; label: string; icon: string }[] = [
    { id: "all", label: "All", icon: "dashboard" },
    { id: "instagram", label: "Instagram", icon: "photo-camera" },
    { id: "twitter", label: "Twitter", icon: "chat" },
    { id: "tiktok", label: "TikTok", icon: "music-note" },
    { id: "linkedin", label: "LinkedIn", icon: "work" },
  ];

  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    // TODO: Backend Integration - Fetch filtered data for selected platform
    console.log(`Platform changed to: ${platform}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <Text style={styles.headerSubtitle}>Track your social media growth</Text>
        </Animated.View>

        {/* Platform Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.platformScroll}
          contentContainerStyle={styles.platformContainer}
        >
          {platforms.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.platformChip,
                selectedPlatform === platform.id && styles.platformChipActive,
              ]}
              onPress={() => handlePlatformChange(platform.id)}
            >
              <IconSymbol
                ios_icon_name={platform.icon}
                android_material_icon_name={platform.icon}
                size={18}
                color={
                  selectedPlatform === platform.id ? colors.background : colors.text
                }
              />
              <Text
                style={[
                  styles.platformChipText,
                  selectedPlatform === platform.id && styles.platformChipTextActive,
                ]}
              >
                {platform.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <Animated.View
              key={metric.id}
              style={[
                styles.metricCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={[metric.color + "40", metric.color + "10"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.metricGradient}
              >
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconContainer, { backgroundColor: metric.color }]}>
                    <IconSymbol
                      ios_icon_name={metric.icon}
                      android_material_icon_name={metric.icon}
                      size={24}
                      color={colors.background}
                    />
                  </View>
                  <View
                    style={[
                      styles.changeContainer,
                      {
                        backgroundColor:
                          metric.change >= 0
                            ? colors.success + "20"
                            : colors.error + "20",
                      },
                    ]}
                  >
                    <IconSymbol
                      ios_icon_name={metric.change >= 0 ? "arrow.up" : "arrow.down"}
                      android_material_icon_name={
                        metric.change >= 0 ? "arrow-upward" : "arrow-downward"
                      }
                      size={14}
                      color={metric.change >= 0 ? colors.success : colors.error}
                    />
                    <Text
                      style={[
                        styles.changeText,
                        { color: metric.change >= 0 ? colors.success : colors.error },
                      ]}
                    >
                      {Math.abs(metric.change)}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Follower Growth Chart */}
        <Animated.View style={[styles.chartCard, { opacity: fadeAnim }]}>
          <Text style={styles.chartTitle}>Follower Growth</Text>
          <Text style={styles.chartSubtitle}>Last 7 days</Text>
          <View style={styles.chartContainer}>
            <LineChart
              style={styles.chart}
              data={trendData}
              svg={{
                stroke: colors.primary,
                strokeWidth: 3,
              }}
              contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
              curve={shape.curveNatural}
            >
            </LineChart>
          </View>
        </Animated.View>

        {/* Goals Section */}
        <Animated.View style={[styles.goalsSection, { opacity: fadeAnim }]}>
          <View style={styles.goalsSectionHeader}>
            <Text style={styles.goalsTitle}>Active Goals</Text>
            <TouchableOpacity
              onPress={() => {
                // TODO: Backend Integration - Open modal to add new goal
                console.log("Add new goal");
              }}
            >
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalCard}
                onPress={() => {
                  // TODO: Backend Integration - Open goal details/edit modal
                  console.log(`Goal tapped: ${goal.id}`);
                }}
              >
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalPlatform}>{goal.platform}</Text>
                </View>
                <View style={styles.goalProgressContainer}>
                  <View style={styles.goalProgressBar}>
                    <LinearGradient
                      colors={[colors.primary, colors.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.goalProgressFill, { width: `${Math.min(progress, 100)}%` }]}
                    />
                  </View>
                  <Text style={styles.goalProgressText}>{progress.toFixed(0)}%</Text>
                </View>
                <Text style={styles.goalStats}>
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  platformScroll: {
    marginBottom: 24,
  },
  platformContainer: {
    flexDirection: "row",
    gap: 8,
  },
  platformChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  platformChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  platformChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  platformChipTextActive: {
    color: colors.background,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: (width - 44) / 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  metricGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
    marginTop: 8,
  },
  chart: {
    flex: 1,
  },
  goalsSection: {
    marginBottom: 24,
  },
  goalsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  goalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  goalPlatform: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  goalProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    minWidth: 40,
    textAlign: "right",
  },
  goalStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
