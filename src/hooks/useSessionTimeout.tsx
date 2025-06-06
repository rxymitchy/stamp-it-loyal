
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_TIME = 2 * 60 * 1000; // Show warning 2 minutes before timeout

export const useSessionTimeout = () => {
  const { forceSignOut, user } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = useCallback(() => {
    if (!user) return;

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    lastActivityRef.current = Date.now();

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      console.log('Session will expire in 2 minutes due to inactivity');
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set session timeout
    timeoutRef.current = setTimeout(async () => {
      console.log('Session expired due to inactivity');
      await forceSignOut();
    }, SESSION_TIMEOUT);
  }, [user, forceSignOut]);

  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      resetTimeout();
    };

    // Events that indicate user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timeout
    resetTimeout();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [user, resetTimeout]);

  return { resetTimeout };
};
