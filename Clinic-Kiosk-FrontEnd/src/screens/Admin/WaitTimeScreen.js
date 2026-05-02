import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/theme';
import { ArrowLeft, Minus, Plus } from 'lucide-react-native';
import { CustomButton } from '../../components/Button';
import { CustomInput } from '../../components/Input';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

const WaitTimeScreen = ({ navigation }) => {
  useSessionTimeout(30, () => {
    navigation.replace('Home');
  });
  const [selectedQueue, setSelectedQueue] = useState('Chiro');
  const [waitTime, setWaitTime] = useState(30);
  const [note, setNote] = useState('');

  const handleAdjust = (amount) => {
    setWaitTime(prev => Math.max(0, prev + amount));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={COLORS.primary} size={24} />
          <Text style={styles.backText}>Back to Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Wait Time</Text>
        <View style={styles.headerRight}>
           <Text style={styles.lastUpdated}>Last updated: 10:12 AM</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Queue</Text>
            <View style={styles.pickerContainer}>
               <Text style={styles.pickerText}>Chiro Adjustment</Text>
               <ArrowLeft size={20} color={COLORS.textSecondary} style={{ transform: [{ rotate: '-90deg' }] }} />
            </View>
            <Text style={styles.helpText}>Choose the queue you want to update.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estimated Wait Time</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity style={styles.stepperButton} onPress={() => handleAdjust(-5)}>
                <Minus size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <View style={styles.timeDisplay}>
                <Text style={styles.timeValue}>{waitTime}</Text>
                <Text style={styles.timeUnit}>minutes</Text>
              </View>
              <TouchableOpacity style={styles.stepperButton} onPress={() => handleAdjust(5)}>
                <Plus size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.helpText}>Enter the current estimated wait time for this queue.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Note (Optional)</Text>
            <CustomInput
              placeholder="Add a note for staff or patients..."
              value={note}
              onChangeText={setNote}
              style={styles.noteInput}
            />
          </View>

          <CustomButton
            title="Save Wait Time"
            onPress={() => navigation.goBack()}
            style={styles.saveButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  backText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 200,
    alignItems: 'flex-end',
  },
  lastUpdated: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SPACING.xxl,
    ...SHADOWS.medium,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  pickerText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  timeUnit: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  noteInput: {
    height: 80,
  },
  saveButton: {
    marginTop: SPACING.xl,
  }
});

export default WaitTimeScreen;
