import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/theme';
import { CustomButton } from '../../components/Button';
import { ArrowLeft, Calendar, Clock, User, UserCheck, ClipboardList } from 'lucide-react-native';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

const AppointmentFoundScreen = ({ navigation, route }) => {
  const { appointment } = route.params;

  useSessionTimeout(5, () => {
    navigation.navigate('Home');
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={COLORS.primary} size={24} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Appointment Found</Text>
        <Text style={styles.subtitle}>Please review your appointment details.</Text>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Calendar size={20} color={COLORS.textSecondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{appointment.appointmentDate}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Clock size={20} color={COLORS.textSecondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{appointment.appointmentTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <User size={20} color={COLORS.textSecondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Patient</Text>
              <Text style={styles.value}>{appointment.firstName} {appointment.lastName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <UserCheck size={20} color={COLORS.textSecondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Provider</Text>
              <Text style={styles.value}>{appointment.providerName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <ClipboardList size={20} color={COLORS.textSecondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>{appointment.appointmentType}</Text>
            </View>
          </View>
        </View>

        <CustomButton
          title="Confirm Appointment"
          onPress={() => navigation.navigate('Consent', { appointment })}
          style={styles.confirmButton}
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
  header: {
    padding: SPACING.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: SPACING.xs,
    fontSize: SIZES.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    ...SHADOWS.light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: SPACING.md,
    alignItems: 'center',
  },
  label: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  confirmButton: {
    width: '100%',
    maxWidth: 600,
  }
});

export default AppointmentFoundScreen;
