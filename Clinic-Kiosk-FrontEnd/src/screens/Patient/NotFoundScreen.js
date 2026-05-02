import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../constants/theme';
import { CustomButton } from '../../components/Button';
import { SearchX } from 'lucide-react-native';

const NotFoundScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <SearchX size={100} color={COLORS.textSecondary} />
        </View>

        <Text style={styles.title}>No Appointment Found</Text>
        <Text style={styles.subtitle}>
          We couldn't find an appointment with that information.
        </Text>
        
        <View style={styles.divider} />

        <Text style={styles.helpText}>
          Please reach out to a front desk team member for assistance.
        </Text>

        <CustomButton
          title="Back to Search"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
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
  iconContainer: {
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.secondary,
    padding: SPACING.xl,
    borderRadius: 100,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  helpText: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    maxWidth: 300,
  },
  backButton: {
    width: '100%',
    maxWidth: 300,
  }
});

export default NotFoundScreen;
