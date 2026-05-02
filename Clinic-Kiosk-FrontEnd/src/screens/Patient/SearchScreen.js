import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../constants/theme';
import { CustomButton } from '../../components/Button';
import { CustomInput } from '../../components/Input';
import { ArrowLeft, User, Phone, Info, AlertCircle } from 'lucide-react-native';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import API from '../../services/api';

const SearchScreen = ({ navigation }) => {
  const [searchType, setSearchType] = useState('name'); // 'name' or 'phone'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useSessionTimeout(5, () => {
    navigation.navigate('Home');
  });

  const handleSearch = async () => {
    if (searchType === 'name' && (!firstName.trim() || !lastName.trim())) return;
    if (searchType === 'phone' && !phoneNumber.trim()) return;
    
    setLoading(true);
    try {
      let params = {};
      if (searchType === 'name') {
        params = { firstName, lastName };
      } else {
        params = { value: phoneNumber };
      }

      const found = await API.searchAppointment(searchType, params);

      if (found) {
        navigation.navigate('AppointmentFound', { appointment: found });
      } else {
        navigation.navigate('NotFound');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('An error occurred during search. Please try again.');
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

      <View style={styles.content}>
        <Text style={styles.title}>Find Your Appointment</Text>
        <Text style={styles.subtitle}>Search by name or phone number.</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, searchType === 'name' && styles.activeTab]}
            onPress={() => { setSearchType('name'); }}
          >
            <User size={20} color={searchType === 'name' ? COLORS.white : COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.tabText, searchType === 'name' && styles.activeTabText]}>Search by Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, searchType === 'phone' && styles.activeTab]}
            onPress={() => { setSearchType('phone'); }}
          >
            <Phone size={20} color={searchType === 'phone' ? COLORS.white : COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.tabText, searchType === 'phone' && styles.activeTabText]}>By Phone Number</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          {searchType === 'name' ? (
            <View>
              <View style={styles.mandatoryNotice}>
                <AlertCircle size={18} color="#FF9800" />
                <Text style={styles.mandatoryText}>Both First & Last Name are required for check-in</Text>
              </View>
              <View style={styles.nameRow}>
                <View style={styles.flex1}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <CustomInput
                    placeholder="e.g. John"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={{ width: SPACING.md }} />
                <View style={styles.flex1}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <CustomInput
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <CustomInput
                placeholder="(512) 555-1234"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          )}
        </View>

        <CustomButton
          title="Search"
          onPress={handleSearch}
          loading={loading}
          disabled={searchType === 'name' ? (!firstName.trim() || !lastName.trim()) : !phoneNumber.trim()}
          style={styles.searchButton}
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
    marginBottom: SPACING.xxl,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    padding: 6,
    marginBottom: SPACING.xl,
    width: '100%',
    maxWidth: 600,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius - 2,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.white,
  },
  inputWrapper: {
    width: '100%',
    maxWidth: 600,
    marginBottom: SPACING.xl,
  },
  nameRow: {
    flexDirection: 'row',
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginLeft: 4,
  },
  mandatoryNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  mandatoryText: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '600',
    marginLeft: 10,
  },
  searchButton: {
    width: '100%',
    maxWidth: 600,
  }
});

export default SearchScreen;
