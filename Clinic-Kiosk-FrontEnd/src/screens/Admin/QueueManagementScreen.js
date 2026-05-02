import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/theme';
import { ArrowLeft, ArrowUp, ArrowDown, X, RefreshCw } from 'lucide-react-native';
import API from '../../services/api';
import { CustomButton } from '../../components/Button';
import { CustomInput } from '../../components/Input';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

const QueueManagementScreen = ({ navigation, route }) => {
  const { queueId, queueName } = route.params;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState(''); // 'moveUp', 'moveDown', 'remove'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchQueue();
  }, []);

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  };

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const allQueues = await API.getQueues();
      const queuePatients = allQueues[queueId] || [];
      
      // Sort patients by appointment time
      const sortedPatients = [...queuePatients].sort((a, b) => {
        return parseTime(a.appointmentTime) - parseTime(b.appointmentTime);
      });
      
      setPatients(sortedPatients);
    } catch (error) {
      console.error('Fetch queue error:', error);
    } finally {
      setLoading(false);
    }
  };

  useSessionTimeout(30, () => {
    navigation.replace('Home');
  });

  const handleMoveToRoom = async (patient) => {
    setLoading(true);
    try {
      await API.updateStatus(patient.appointmentId, 'ExamRoom-Inprogress');
      await fetchQueue();
    } catch (error) {
      alert('Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (patient, type) => {
    setSelectedPatient(patient);
    setActionType(type);
    setModalVisible(true);
  };

  const confirmAction = () => {
    // Logic to update patients array would go here
    setModalVisible(false);
    setComment('');
  };

  const renderPatientItem = ({ item, index }) => (
    <View style={styles.patientRow}>
      <Text style={styles.positionText}>{index + 1}</Text>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.firstName} {item.lastName}</Text>
      </View>
      <Text style={styles.arrivalTime}>{item.appointmentTime}</Text>
      <View style={[
        styles.statusBadge,
        item.status === 'head to room' && { backgroundColor: '#E8F5E9' },
        item.status === 'wait in lobby' && { backgroundColor: '#FFF3E0' },
        item.status === 'wait outside' && { backgroundColor: '#F5F5F5' },
        item.status === 'examRoom-Inprogress' && { backgroundColor: '#E3F2FD' }
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'head to room' && { color: '#2E7D32' },
          item.status === 'wait in lobby' && { color: '#EF6C00' },
          item.status === 'wait outside' && { color: '#757575' },
          item.status === 'examRoom-Inprogress' && { color: '#1565C0' }
        ]}>{item.status}</Text>
      </View>
      <View style={styles.actions}>
        {item.status === 'wait in lobby' && (
          <TouchableOpacity
            style={styles.moveToRoomButton}
            onPress={() => handleMoveToRoom(item)}
          >
            <Text style={styles.moveToRoomText}>Move to Room</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(item, 'moveUp')}
          disabled={index === 0}
        >
          <ArrowUp size={20} color={index === 0 ? COLORS.border : COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(item, 'moveDown')}
          disabled={index === patients.length - 1}
        >
          <ArrowDown size={20} color={index === patients.length - 1 ? COLORS.border : COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleAction(item, 'remove')}
        >
          <X size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={COLORS.primary} size={24} />
          <Text style={styles.backText}>Back to Queues</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{queueName} Queue</Text>
          <Text style={styles.headerSubtitle}>{patients.length} People</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshHeaderButton}
          onPress={fetchQueue}
          disabled={loading}
          activeOpacity={0.6}
        >
          <RefreshCw size={18} color={loading ? COLORS.primary : COLORS.textSecondary} />
          <Text style={styles.lastUpdated}>{loading ? 'Refreshing...' : 'Refresh Queue'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnLabel, { width: 40 }]}>#</Text>
            <Text style={[styles.columnLabel, { width: 200 }]}>Patient Name</Text>
            <Text style={[styles.columnLabel, { width: 100 }]}>Arrival</Text>
            <Text style={[styles.columnLabel, { width: 120 }]}>Status</Text>
            <Text style={[styles.columnLabel, { width: 250, textAlign: 'center' }]}>Actions</Text>
          </View>

          <FlatList
            data={patients}
            renderItem={renderPatientItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>

      {/* Action Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {actionType === 'remove' ? 'Remove Patient from Queue' : `Move Patient ${actionType === 'moveUp' ? 'Up' : 'Down'}`}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              You are about to {actionType === 'remove' ? 'remove' : 'move'} the following patient {actionType !== 'remove' ? 'in the queue' : ''}:
            </Text>

            <View style={styles.patientPreview}>
              <Text style={styles.previewName}>{selectedPatient?.name}</Text>
              <Text style={styles.previewDetail}>Current Position: #3 → New Position: #2</Text>
            </View>

            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Please provide a reason for this change:</Text>
              <CustomInput
                placeholder="Enter reason here..."
                value={comment}
                onChangeText={setComment}
                style={styles.commentInput}
              />
              <Text style={styles.requiredText}>(Required)</Text>
            </View>

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={styles.modalCancelButton}
              />
              <CustomButton
                title={actionType === 'remove' ? 'Remove from Queue' : `Confirm Move ${actionType === 'moveUp' ? 'Up' : 'Down'}`}
                onPress={confirmAction}
                style={[styles.modalConfirmButton, actionType === 'remove' && { backgroundColor: COLORS.error }]}
                disabled={!comment}
              />
            </View>

            <View style={[styles.infoAlert, actionType === 'remove' && styles.errorAlert]}>
              <Text style={[styles.infoAlertText, actionType === 'remove' && styles.errorAlertText]}>
                {actionType === 'remove' ? 'This patient will be removed from the queue.' : `This patient will move ${actionType === 'moveUp' ? 'up' : 'down'} one position in the queue.`}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
  },
  backText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '500',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  refreshHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginLeft: 6,
    fontWeight: '600',
  },
  tableContainer: {
    minWidth: 600,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  positionText: {
    width: 40,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  patientInfo: {
    width: 200,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  arrivalTime: {
    width: 100,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    width: 120,
    backgroundColor: COLORS.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  actions: {
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  moveToRoomButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 4,
  },
  moveToRoomText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    borderColor: '#FFEBEE',
    backgroundColor: '#FFF5F5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  patientPreview: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  previewDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  commentSection: {
    marginBottom: SPACING.xl,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  commentInput: {
    marginBottom: 4,
  },
  requiredText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalConfirmButton: {
    flex: 2,
  },
  infoAlert: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  infoAlertText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
  },
  errorAlert: {
    backgroundColor: '#FFF5F5',
  },
  errorAlertText: {
    color: COLORS.error,
  }
});

export default QueueManagementScreen;
