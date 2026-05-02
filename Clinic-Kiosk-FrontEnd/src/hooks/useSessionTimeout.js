import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';

export const useSessionTimeout = (timeoutMinutes, onTimeout, promptBefore = 30000) => {
  const timerRef = useRef(null);
  const promptRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (promptRef.current) clearTimeout(promptRef.current);

    const timeoutMs = timeoutMinutes * 60 * 1000;
    
    // Set a timer to prompt the user before actual timeout
    promptRef.current = setTimeout(() => {
      Alert.alert(
        "Session Timeout",
        "Your session is about to expire. Do you need more time?",
        [
          { text: "Yes, I'm still here", onPress: resetTimer },
          { text: "No, Exit", onPress: onTimeout }
        ]
      );
    }, timeoutMs - promptBefore);

    // Set the actual timeout
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (promptRef.current) clearTimeout(promptRef.current);
    };
  }, []);

  return { resetTimer };
};
