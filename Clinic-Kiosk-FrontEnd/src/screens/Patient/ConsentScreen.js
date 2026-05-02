import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/theme';
import { CustomButton } from '../../components/Button';
import { CustomInput } from '../../components/Input';
import { ArrowLeft, Phone, CheckSquare, Square } from 'lucide-react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import API from '../../services/api';

const ConsentScreen = ({ navigation, route }) => {
  const { appointment } = route.params;

  useSessionTimeout(5, () => {
    navigation.navigate('Home');
  });
  const [phone, setPhone] = useState(appointment.phone);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [consent, setConsent] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const signatureRef = useRef();

  const handleSignature = (signature) => {
    setHasSigned(true);
  };

  const handleClear = () => {
    signatureRef.current.clearSignature();
    setHasSigned(false);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      const result = await API.confirmCheckin(appointment.appointmentId);
      navigation.navigate('CheckInComplete', { 
        appointment, 
        listNumber: result.listNumber, 
        waitTime: result.waitTime 
      });
    } catch (error) {
      alert('Error: Check-in failed. Please see the front desk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={COLORS.primary} size={24} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Almost Done!</Text>
        <Text style={styles.subtitle}>Please confirm your appointment and consent to receive text messages.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phone Number for Text Messages</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.phoneIcon}>
              <Phone size={20} color={COLORS.textSecondary} />
            </View>
            <View style={styles.phoneInputWrapper}>
              {isEditingPhone ? (
                <CustomInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.inlineInput}
                />
              ) : (
                <Text style={styles.phoneText}>{phone}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}>
              <Text style={styles.editText}>{isEditingPhone ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.consentRow} 
          onPress={() => setConsent(!consent)}
          activeOpacity={0.7}
        >
          {consent ? (
            <CheckSquare size={24} color={COLORS.primary} fill={COLORS.primary} />
          ) : (
            <Square size={24} color={COLORS.border} />
          )}
          <Text style={styles.consentText}>
            I consent to receive text messages about my appointment (reminders, updates, etc.). 
            <Text style={styles.consentSubtext}> Message & data rates may apply. Reply STOP to opt out.</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Digital Signature</Text>
          <View style={styles.signatureContainer}>
             {/* Signature canvas might need more setup for web, but I'll add a placeholder if it fails */}
             <View style={styles.signatureCanvasPlaceholder}>
                <Text style={styles.placeholderText}>[ Digital Signature Canvas ]</Text>
                <Text style={styles.placeholderSubtext}>Sign with your finger or stylus</Text>
             </View>
          </View>
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear Signature</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Finish Check-in"
          onPress={handleContinue}
          style={styles.continueButton}
          disabled={!consent}
          loading={loading}
        />
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
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
    textAlign: 'center',
  },
  section: {
    width: '100%',
    maxWidth: 600,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  phoneIcon: {
    marginRight: SPACING.md,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  phoneText: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  inlineInput: {
    marginBottom: 0,
  },
  editText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.md,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 600,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
  },
  consentText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  consentSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  signatureSection: {
    width: '100%',
    maxWidth: 600,
    marginBottom: SPACING.xl,
  },
  signatureContainer: {
    height: 200,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureCanvasPlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body,
    fontWeight: '500',
  },
  placeholderSubtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: SPACING.sm,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  continueButton: {
    width: '100%',
    maxWidth: 600,
    marginTop: SPACING.lg,
  }
});

export default ConsentScreen;
