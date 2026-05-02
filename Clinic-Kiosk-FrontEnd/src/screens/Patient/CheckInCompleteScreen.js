import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../constants/theme';
import { CustomButton } from '../../components/Button';
import { CheckCircle2, Home } from 'lucide-react-native';

const CheckInCompleteScreen = ({ navigation, route }) => {
  const { listNumber, waitTime } = route.params || { listNumber: '-', waitTime: '-' };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <CheckCircle2 size={120} color={COLORS.accent} />
        </View>

        <Text style={styles.title}>You’re All Set!</Text>
        <Text style={styles.subtitle}>You have successfully checked in. We’ll text you if there are any updates.</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Queue Number</Text>
            <Text style={styles.infoValue}>#{listNumber}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Est. Wait Time</Text>
            <Text style={styles.infoValue}>{waitTime} mins</Text>
          </View>
        </View>

        <CustomButton
          title="Return to Home"
          onPress={() => navigation.navigate('Home')}
          style={styles.homeButton}
          textStyle={styles.homeButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  successIconContainer: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: SIZES.h3,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    maxWidth: 500,
  },
  infoCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    padding: SPACING.xl,
    flexDirection: 'row',
    marginBottom: SPACING.xxl,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  homeButton: {
    width: '100%',
    maxWidth: 400,
    height: 60,
  },
  homeButtonText: {
    fontSize: SIZES.body,
  }
});

export default CheckInCompleteScreen;
