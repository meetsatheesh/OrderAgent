import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Patient Screens
import HomeScreen from '../screens/Patient/HomeScreen';
import SearchScreen from '../screens/Patient/SearchScreen';
import AppointmentFoundScreen from '../screens/Patient/AppointmentFoundScreen';
import NotFoundScreen from '../screens/Patient/NotFoundScreen';
import ConsentScreen from '../screens/Patient/ConsentScreen';
import CheckInCompleteScreen from '../screens/Patient/CheckInCompleteScreen';

// Admin Screens
import AdminLoginScreen from '../screens/Admin/LoginScreen';
import DashboardScreen from '../screens/Admin/DashboardScreen';
import QueueManagementScreen from '../screens/Admin/QueueManagementScreen';
import WaitTimeScreen from '../screens/Admin/WaitTimeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
        gestureEnabled: false,
      }}
    >
      {/* Patient Flow */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="AppointmentFound" component={AppointmentFoundScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
      <Stack.Screen name="Consent" component={ConsentScreen} />
      <Stack.Screen name="CheckInComplete" component={CheckInCompleteScreen} />

      {/* Admin Flow */}
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
      <Stack.Screen name="QueueManagement" component={QueueManagementScreen} />
      <Stack.Screen name="WaitTimeSettings" component={WaitTimeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
