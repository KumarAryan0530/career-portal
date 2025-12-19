// Authentication Context - Manages user authentication state globally
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register new user
  const signup = async (email, password, role, profileData) => {
    try {
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profileData.fullName,
            role: role
          }
        }
      });

      if (authError) throw authError;

      const user = authData.user;

      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: email,
          role: role,
          full_name: profileData.fullName,
          phone: profileData.phone || '',
          company: profileData.company || '',
          title: profileData.title || '',
          bio: profileData.bio || '',
          skills: profileData.skills || [],
          experience: profileData.experience || '',
          education: profileData.education || '',
          location: profileData.location || '',
          linked_in: profileData.linkedIn || '',
          portfolio: profileData.portfolio || '',
          resume_url: '',
          resume_name: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
      setUserRole(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Fetch user profile from Supabase
  const fetchUserProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to user metadata
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.role) {
          const fallbackProfile = {
            uid: user.id,
            email: user.email,
            role: user.user_metadata.role,
            fullName: user.user_metadata.full_name || ''
          };
          setUserProfile(fallbackProfile);
          setUserRole(fallbackProfile.role);
          return fallbackProfile;
        }
        return null;
      }

      if (data) {
        // Transform snake_case to camelCase
        const profile = {
          uid: data.id,
          email: data.email,
          role: data.role,
          fullName: data.full_name,
          phone: data.phone,
          company: data.company,
          title: data.title,
          bio: data.bio,
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          location: data.location,
          linkedIn: data.linked_in,
          portfolio: data.portfolio,
          resumeUrl: data.resume_url,
          resumeName: data.resume_name,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        setUserProfile(profile);
        setUserRole(profile.role);
        return profile;
      }
      
      // No profile found - fallback to user metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role) {
        const fallbackProfile = {
          uid: user.id,
          email: user.email,
          role: user.user_metadata.role,
          fullName: user.user_metadata.full_name || ''
        };
        setUserProfile(fallbackProfile);
        setUserRole(fallbackProfile.role);
        return fallbackProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!currentUser) return;

    try {
      // Transform camelCase to snake_case for Supabase
      const updateData = {
        full_name: profileData.fullName,
        phone: profileData.phone,
        company: profileData.company,
        title: profileData.title,
        bio: profileData.bio,
        skills: profileData.skills,
        experience: profileData.experience,
        education: profileData.education,
        location: profileData.location,
        linked_in: profileData.linkedIn,
        portfolio: profileData.portfolio,
        resume_url: profileData.resumeUrl,
        resume_name: profileData.resumeName,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', currentUser.id);

      if (error) throw error;

      // Refresh profile
      await fetchUserProfile(currentUser.id);
    } catch (error) {
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        // Use metadata as fallback immediately
        const role = session.user.user_metadata?.role || 'candidate';
        setUserRole(role);
        setUserProfile({
          uid: session.user.id,
          email: session.user.email,
          role: role,
          fullName: session.user.user_metadata?.full_name || ''
        });
        // Try to fetch full profile from DB (non-blocking)
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Error getting session:', err);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          const role = session.user.user_metadata?.role || 'candidate';
          setUserRole(role);
          setUserProfile({
            uid: session.user.id,
            email: session.user.email,
            role: role,
            fullName: session.user.user_metadata?.full_name || ''
          });
          // Try to fetch full profile from DB
          fetchUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    userRole,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
