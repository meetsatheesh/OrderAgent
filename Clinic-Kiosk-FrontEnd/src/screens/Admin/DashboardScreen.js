import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/theme';
import { ChevronRight, Users, Clock, ClipboardList, RefreshCw, Upload, LogOut } from 'lucide-react-native';
import { MOCK_QUEUES, MOCK_WAIT_TIMES } from '../../services/mockData';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import API from '../../services/api';

const DashboardScreen = ({ navigation }) => {
  const [importing, setImporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queueData, setQueueData] = useState({ PT: [], Chiro: [], Review: [] });
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await API.getQueues();
      setQueueData(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  useSessionTimeout(30, () => {
    navigation.replace('Home');
  });

  const handleImport = async () => {
    setImporting(true);
    try {
      // Simulation of file picking and upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Appointments imported successfully.');
      fetchData(); // Refresh counts after import
    } catch (error) {
      Alert.alert('Error', 'Failed to import.');
    } finally {
      setImporting(false);
    }
  };

  const queues = [
    { id: 'PT', name: 'PT', fullName: 'Physical Therapy', count: queueData.PT.length, waitTime: queueData.PT.length * 15, icon: <Users size={24} color="#4CAF50" />, color: '#E8F5E9' },
    { id: 'Chiro', name: 'Chiro Adjustment', fullName: 'Chiropractic Adjustment', count: queueData.Chiro.length, waitTime: queueData.Chiro.length * 10, icon: <Users size={24} color="#2196F3" />, color: '#E3F2FD' },
    { id: 'Review', name: 'Review', fullName: 'Review / Follow Up', count: queueData.Review.length, waitTime: queueData.Review.length * 5, icon: <ClipboardList size={24} color="#9C27B0" />, color: '#F3E5F5' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/fazel_chiro_logo.png')} 
            style={styles.logo}
          />
          <View>
            <Text style={styles.clinicName}>FAZEL CHIROPRACTIC INC.</Text>
            <Text style={styles.clinicSubName}>SANAM FAZEL D.C.</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => navigation.replace('Home')}
          >
            <LogOut size={20} color={COLORS.error || '#FF5252'} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adminProfile}>
            <View style={styles.avatar} />
            <Text style={styles.adminName}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Queues Overview</Text>
            <Text style={styles.sectionSubtitle}>View and manage all appointment queues.</Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchData} 
            disabled={loading}
            activeOpacity={0.6}
          >
            <RefreshCw size={18} color={loading ? COLORS.primary : COLORS.textSecondary} />
            <Text style={styles.refreshText}>
              {loading ? 'Refreshing...' : `Last updated: ${lastUpdated}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.queueGrid}>
          {queues.map((queue) => (
            <TouchableOpacity 
              key={queue.id} 
              style={styles.queueCard}
              onPress={() => navigation.navigate('QueueManagement', { queueId: queue.id, queueName: queue.name })}
            >
              <View style={[styles.iconContainer, { backgroundColor: queue.color }]}>
                {queue.icon}
              </View>
              <View style={styles.queueInfo}>
                <Text style={styles.queueName} numberOfLines={1}>{queue.name}</Text>
                <Text style={styles.queueFullName} numberOfLines={1}>{queue.fullName}</Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{queue.count}</Text>
                  <Text style={styles.statLabel} numberOfLines={1}>People</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{queue.waitTime}m</Text>
                  <Text style={styles.statLabel} numberOfLines={1}>Wait</Text>
                </View>
              </View>
              <ChevronRight size={24} color={COLORS.border} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={{ marginTop: SPACING.xl }}>
            <Text style={styles.sectionTitle}>Admin Actions</Text>
            <Text style={styles.sectionSubtitle}>Quick management tools.</Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleImport}
            disabled={importing}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Upload size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>{importing ? 'Importing...' : 'Import Appointments'}</Text>
              <Text style={styles.actionDescription}>Upload Excel file from 3rd party system</Text>
            </View>
            <ChevronRight size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomTabs}>
           <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Users size={20} color={COLORS.primary} />
              <Text style={[styles.tabText, styles.activeTabText]}>Queues</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('WaitTimeSettings')}>
              <Clock size={20} color={COLORS.textSecondary} />
              <Text style={styles.tabText}>Wait Times</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.tab}>
              <ClipboardList size={20} color={COLORS.textSecondary} />
              <Text style={styles.tabText}>Reports</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 80,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: SPACING.md,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  clinicSubName: {
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.accent,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: 20,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  adminName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
    padding: 8,
  },
  logoutText: {
    marginLeft: 6,
    color: COLORS.error || '#FF5252',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    padding: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  queueGrid: {
    gap: SPACING.md,
  },
  queueCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  queueInfo: {
    flex: 1,
  },
  queueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  queueFullName: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    minWidth: 50,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: SPACING.xxl,
    borderRadius: SIZES.radius,
    padding: 8,
    ...SHADOWS.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius - 4,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  actionGrid: {
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default DashboardScreen;
