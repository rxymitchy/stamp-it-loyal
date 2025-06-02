
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAutoLogout = () => {
  const { signOut, user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Store the initial app version/timestamp
    const appVersion = localStorage.getItem('app_version');
    const currentVersion = Date.now().toString();

    // If this is the first load, set the version
    if (!appVersion) {
      localStorage.setItem('app_version', currentVersion);
      return;
    }

    // Check for hot reload or development changes
    const handleBeforeUnload = () => {
      // Mark that the page is being refreshed/reloaded
      sessionStorage.setItem('page_refreshing', 'true');
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Check if this is after a page refresh during development
        const wasRefreshing = sessionStorage.getItem('page_refreshing');
        const storedVersion = localStorage.getItem('app_version');
        
        if (wasRefreshing || storedVersion !== currentVersion) {
          console.log('App update detected, logging out for fresh state');
          sessionStorage.removeItem('page_refreshing');
          localStorage.setItem('app_version', currentVersion);
          await signOut();
        }
      }
    };

    // Listen for page unload and visibility changes
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check for version mismatch on mount
    if (appVersion !== currentVersion) {
      console.log('Version mismatch detected, updating version');
      localStorage.setItem('app_version', currentVersion);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, signOut]);
};
