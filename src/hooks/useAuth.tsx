
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export interface UserProfile {
  id: string;
  email: string;
  role: 'customer' | 'business';
}

const MAX_LOADING_TIME = 15000; // 15 seconds max loading time

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      
      if (profileData) {
        console.log('Profile fetched successfully:', profileData);
        setProfile(profileData);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(`Failed to load profile: ${error.message}`);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    let loadingTimeout: NodeJS.Timeout;

    // Set a maximum loading time to prevent infinite loading
    loadingTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('Loading timeout reached, stopping loading state');
        setLoading(false);
        setError('Loading timeout - please try refreshing the page');
      }
    }, MAX_LOADING_TIME);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            await fetchProfile(session.user.id);
          } catch (error) {
            console.error('Profile fetch failed in auth state change:', error);
          }
        } else {
          setProfile(null);
          setError(null);
        }
        
        if (mounted) {
          setLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    );

    // Check for existing session immediately
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setLoading(false);
            setError(`Session error: ${error.message}`);
            clearTimeout(loadingTimeout);
          }
          return;
        }
        
        if (!mounted) return;
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          try {
            await fetchProfile(session.user.id);
          } catch (error) {
            console.error('Profile fetch failed in initialization:', error);
          }
        }
        
        if (mounted) {
          setLoading(false);
          clearTimeout(loadingTimeout);
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          setError(`Initialization error: ${error.message}`);
          clearTimeout(loadingTimeout);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      setLoading(true);
      setError(null);
      
      await supabase.auth.signOut();
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Clear any stored app version to ensure fresh state
      localStorage.removeItem('app_version');
      sessionStorage.clear();
      
      console.log('Sign out successful, navigating to home');
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(`Sign out failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    error,
    signOut
  };
};
