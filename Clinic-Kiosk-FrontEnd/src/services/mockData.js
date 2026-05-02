export const MOCK_APPOINTMENTS = [
  { id: '1', patientName: 'John Smith', phone: '5125551234', date: 'May 15, 2025', time: '10:00 AM', provider: 'Dr. Fazel', reason: 'Follow Up', type: 'Chiro Adjustment' },
  { id: '2', patientName: 'Sarah Johnson', phone: '5125555678', date: 'May 15, 2025', time: '10:30 AM', provider: 'Dr. Fazel', reason: 'Initial Consultation', type: 'PT' },
  { id: '3', patientName: 'Michael Brown', phone: '5125559012', date: 'May 15, 2025', time: '11:00 AM', provider: 'Dr. Fazel', reason: 'Back Pain', type: 'Chiro Adjustment' },
  { id: '4', patientName: 'Emily Davis', phone: '5125553456', date: 'May 15, 2025', time: '11:30 AM', provider: 'Dr. Fazel', reason: 'Neck Stiffness', type: 'Chiro Adjustment' },
  { id: '5', patientName: 'David Wilson', phone: '5125557890', date: 'May 15, 2025', time: '12:00 PM', provider: 'Dr. Fazel', reason: 'Shoulder Injury', type: 'PT' },
  { id: '6', patientName: 'Lisa Martinez', phone: '5125551122', date: 'May 15, 2025', time: '01:00 PM', provider: 'Dr. Fazel', reason: 'Routine Checkup', type: 'Review' },
  { id: '7', patientName: 'James Taylor', phone: '5125553344', date: 'May 15, 2025', time: '01:30 PM', provider: 'Dr. Fazel', reason: 'Post-Surgical Rehab', type: 'PT' },
  { id: '8', patientName: 'Robert Garcia', phone: '5125555566', date: 'May 15, 2025', time: '02:00 PM', provider: 'Dr. Fazel', reason: 'Spinal Alignment', type: 'Chiro Adjustment' },
  { id: '9', patientName: 'Patricia White', phone: '5125557788', date: 'May 15, 2025', time: '02:30 PM', provider: 'Dr. Fazel', reason: 'X-Ray Review', type: 'Review' },
  { id: '10', patientName: 'Linda Harris', phone: '5125559900', date: 'May 15, 2025', time: '03:00 PM', provider: 'Dr. Fazel', reason: 'Chronic Pain Management', type: 'PT' }
];

export const MOCK_QUEUES = {
  PT: [
    { id: '101', name: 'John Smith', arrivalTime: '9:00 AM', status: 'In Session' },
    { id: '102', name: 'Sarah Johnson', arrivalTime: '9:05 AM', status: 'Checked In' },
    { id: '103', name: 'Michael Brown', arrivalTime: '9:10 AM', status: 'Checked In' },
    { id: '104', name: 'Emily Davis', arrivalTime: '9:15 AM', status: 'Checked In' },
    { id: '105', name: 'David Wilson', arrivalTime: '9:20 AM', status: 'Checked In' },
    { id: '106', name: 'Lisa Martinez', arrivalTime: '9:25 AM', status: 'Checked In' },
  ],
  Chiro: [
    { id: '201', name: 'James Taylor', arrivalTime: '9:30 AM', status: 'In Session' },
    { id: '202', name: 'Robert Garcia', arrivalTime: '9:35 AM', status: 'Checked In' },
    { id: '203', name: 'Patricia White', arrivalTime: '9:40 AM', status: 'Checked In' },
    { id: '204', name: 'Linda Harris', arrivalTime: '9:45 AM', status: 'Checked In' },
  ],
  Review: [
    { id: '301', name: 'William Miller', arrivalTime: '9:50 AM', status: 'Checked In' },
    { id: '302', name: 'Elizabeth Moore', arrivalTime: '9:55 AM', status: 'Checked In' },
  ]
};

export const MOCK_WAIT_TIMES = {
  PT: 45,
  Chiro: 30,
  Review: 15
};
