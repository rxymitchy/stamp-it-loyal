
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  role: 'customer' | 'business';
}

const MAX_LOADING_TIME = 10000; // 10 seconds max loading time
const SESSION_CHECK_TIMEOUT = 5000; // 5 seconds for session check

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
        
        // If profile doesn't exist, create it based on user metadata
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile');
          const { data: userData } = await supabase.auth.getUser();
          const userRole = userData.user?.user_metadata?.role || 'customer';
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: userData.user?.email || '',
              role: userRole
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }
          
          setProfile(newProfile);
          setError(null);
          return;
        }
        
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

  const clearSession = () => {
    console.log('Clearing session data');
    setUser(null);
    setSession(null);
    setProfile(null);
    setError(null);
    localStorage.removeItem('app_version');
    sessionStorage.clear();
  };

  const forceSignOut = async () => {
    try {
      console.log('Force signing out due to timeout or error');
      await supabase.auth.signOut();
      clearSession();
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error during force sign out:', error);
      // Even if signOut fails, clear local state
      clearSession();
      setLoading(false);
      navigate('/');
    }
  };

  useEffect(() => {
    let mounted = true;
    let loadingTimeout: NodeJS.Timeout;
    let sessionTimeout: NodeJS.Timeout;

    // Set a maximum loading time to prevent infinite loading
    loadingTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('Loading timeout reached, forcing logout');
        forceSignOut();
      }
    }, MAX_LOADING_TIME);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        
        if (!mounted) return;
        
        // Clear any existing timeouts when auth state changes
        if (loadingTimeout) clearTimeout(loadingTimeout);
        if (sessionTimeout) clearTimeout(sessionTimeout);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user's email is confirmed
          if (!session.user.email_confirmed_at) {
            console.log('User email not confirmed');
            toast({
              title: "Email Verification Required",
              description: "Please check your email and click the verification link to complete your registration.",
              variant: "destructive"
            });
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
          
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
        }
      }
    );

    // Check for existing session with timeout
    const initializeAuth = async () => {
      try {
        // Add a timeout to the session check
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          sessionTimeout = setTimeout(() => {
            reject(new Error('Session check timeout'));
          }, SESSION_CHECK_TIMEOUT);
        });

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (sessionTimeout) clearTimeout(sessionTimeout);
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            forceSignOut();
          }
          return;
        }
        
        if (!mounted) return;
        
        if (session?.user) {
          // Check if user's email is confirmed
          if (!session.user.email_confirmed_at) {
            console.log('Existing session but email not confirmed');
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
          
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
          if (loadingTimeout) clearTimeout(loadingTimeout);
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          if (error.message === 'Session check timeout') {
            console.log('Session check timed out, forcing logout');
            forceSignOut();
          } else {
            setLoading(false);
            setError(`Initialization error: ${error.message}`);
            if (loadingTimeout) clearTimeout(loadingTimeout);
          }
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (sessionTimeout) clearTimeout(sessionTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      setLoading(true);
      setError(null);
      
      await supabase.auth.signOut();
      clearSession();
      
      console.log('Sign out successful, navigating to home');
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if signOut fails, clear local state and redirect
      clearSession();
      setError(`Sign out failed: ${error.message}`);
      navigate('/');
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
    signOut,
    forceSignOut
  };
};
