import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../constants/theme';
import { CustomButton } from '../../components/Button';
import { CustomInput } from '../../components/Input';
import API from '../../services/api';

const AdminLoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.login(username, password);
      console.log('Login successful:', response);
      navigation.replace('AdminDashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/fazel_chiro_logo.png')} 
              style={styles.logo}
            />
            <Text style={styles.clinicName}>FAZEL CHIROPRACTIC INC.</Text>
            <Text style={styles.clinicSubName}>SANAM FAZEL D.C.</Text>
          </View>

          <View style={styles.loginForm}>
            <Text style={styles.title}>Admin Login</Text>
            <Text style={styles.subtitle}>Please sign in to your admin account.</Text>

            <CustomInput
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomButton
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={loading}
            />
            
            <Text style={styles.version}>v1.0.0</Text>
          </View>
          
          <CustomButton 
             title="Back to Kiosk" 
             variant="outline" 
             onPress={() => navigation.navigate('Home')}
             style={styles.backButton}
           />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: SPACING.lg,
  },
  clinicName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  clinicSubName: {
    fontSize: 14,
    letterSpacing: 2,
    color: COLORS.accent,
    marginTop: 2,
    fontWeight: '600',
  },
  loginForm: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  loginButton: {
    width: '100%',
    marginTop: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  version: {
    marginTop: SPACING.xl,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  backButton: {
    marginTop: SPACING.xxl,
    borderWidth: 0,
  }
});

export default AdminLoginScreen;
