
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Deep navy background with vibrant indigo/purple/pink accents
export const colors = {
  primary: '#6366f1',      // Vibrant indigo
  secondary: '#8b5cf6',    // Purple
  accent: '#ec4899',       // Pink
  background: '#0f172a',   // Deep navy
  backgroundAlt: '#1e293b', // Lighter navy
  card: '#1e293b',         // Card background
  text: '#f1f5f9',         // Light text
  textSecondary: '#94a3b8', // Secondary text
  success: '#10b981',      // Green for positive metrics
  warning: '#f59e0b',      // Orange for warnings
  error: '#ef4444',        // Red for errors
  border: '#334155',       // Border color
  grey: '#64748b',         // Grey
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: "white",
  },
});
