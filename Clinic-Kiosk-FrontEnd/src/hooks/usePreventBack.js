import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

/**
 * Hook to prevent the user from navigating back using the hardware back button (Android)
 * or the browser back button (Web).
 */
export const usePreventBack = () => {
  useEffect(() => {
    const handleBackPress = () => {
      // Returning true prevents the default back action
      return true;
    };

    // Add listener for Android hardware back button and React Native Web back button events
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Web-specific enhancement: push a dummy state to history to capture the next back button press
    if (Platform.OS === 'web') {
      window.history.pushState(null, null, window.location.href);
      
      const handlePopState = () => {
        // When user clicks back, we immediately push the state back to keep them here
        window.history.pushState(null, null, window.location.href);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        backHandler.remove();
        window.removeEventListener('popstate', handlePopState);
      };
    }

    return () => {
      backHandler.remove();
    };
  }, []);
};
