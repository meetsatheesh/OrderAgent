import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../constants/theme';
import { CustomButton } from '../../components/Button';
import { Calendar } from 'lucide-react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
             <Image 
                source={require('../../assets/fazel_chiro_logo.png')} 
                style={styles.logo}
             />
          </View>
          <Text style={styles.clinicName}>FAZEL CHIROPRACTIC INC.</Text>
          <Text style={styles.clinicSubName}>SANAM FAZEL D.C.</Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitle}>We're glad you're here.</Text>
        </View>

        <CustomButton
          title="Check In"
          onPress={() => navigation.navigate('Search')}
          style={styles.checkInButton}
          textStyle={styles.checkInButtonText}
        />

        <CustomButton 
          title="Admin Login" 
          variant="outline" 
          onPress={() => navigation.navigate('AdminLogin')}
          style={styles.adminButton}
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logo: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
  },
  clinicName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  clinicSubName: {
    fontSize: SIZES.font,
    letterSpacing: 2,
    color: COLORS.accent,
    marginTop: 2,
    fontWeight: '600',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  welcomeText: {
    fontSize: SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.h3,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  checkInButton: {
    width: '100%',
    maxWidth: 400,
    height: 70,
  },
  checkInButtonText: {
    fontSize: SIZES.h2,
  },
  adminButton: {
    width: '100%',
    maxWidth: 400,
    marginTop: SPACING.md,
  }
});

export default HomeScreen;
