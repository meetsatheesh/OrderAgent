import { MOCK_APPOINTMENTS, MOCK_QUEUES, MOCK_WAIT_TIMES } from './mockData';

const BASE_URL = 'https://m7hbbmb9v4.execute-api.us-west-2.amazonaws.com/Prod';

// This service is designed to be easily replaced with real API calls later
const API = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  searchAppointment: async (type, params) => {
    try {
      let queryStr = `type=${type}`;
      if (type === 'name') {
        queryStr += `&firstName=${encodeURIComponent(params.firstName || '')}&lastName=${encodeURIComponent(params.lastName || '')}`;
      } else {
        queryStr += `&value=${encodeURIComponent(params.value || '')}`;
      }

      const response = await fetch(`${BASE_URL}/appointments?${queryStr}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }

      return data.appointments.length > 0 ? data.appointments[0] : null;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  importAppointments: async (base64File) => {
    try {
      const response = await fetch(`${BASE_URL}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_content: base64File }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Import failed');
      }

      return data;
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  },

  confirmCheckin: async (appointmentId) => {
    try {
      const response = await fetch(`${BASE_URL}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Check-in failed');
      }

      return data;
    } catch (error) {
      console.error('Checkin error:', error);
      throw error;
    }
  },

  updateStatus: async (appointmentId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      return data;
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  },

  getQueues: async () => {
    try {
      const response = await fetch(`${BASE_URL}/queues`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch queues');
      }

      return data.queues;
    } catch (error) {
      console.error('GetQueues error:', error);
      throw error;
    }
  },

  updateQueue: async (queueId, patientId, action, comment) => {
    console.log(`Updating queue ${queueId}: Patient ${patientId} ${action} with comment: ${comment}`);
    return { success: true };
  },

  updateWaitTime: async (queueId, time, note) => {
    console.log(`Updating wait time for ${queueId} to ${time} mins. Note: ${note}`);
    return { success: true };
  }
};

export default API;
