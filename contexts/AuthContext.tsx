import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Faculty, Admin } from '@/types';
import { authAPI } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  clearAllData: () => Promise<void>;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email, role });
      
      // Call the real API with the correct format
      const response = await authAPI.login(email, password, role);
      
      if (response && response.token && response.user) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        setToken(response.token);
        setUser(response.user);
        
        console.log('Login successful for user:', response.user.name);
        setIsLoading(false);
        return true;
      } else {
        console.log('Login failed: Invalid response format');
        console.log('Response received:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', response ? Object.keys(response) : 'null');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      
      // Call logout API if token exists
      if (token) {
        console.log('📡 Calling logout API...');
        await authAPI.logout();
        console.log('✅ Logout API call successful');
      } else {
        console.log('⚠️ No token found, skipping API call');
      }
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Continue with local logout even if API fails
    }
    
    try {
      // Clear local storage more thoroughly
      console.log('🗑️ Clearing local storage...');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      // Also clear any other potential auth-related keys
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userProfile');
      
      console.log('✅ Local storage cleared');
    } catch (storageError) {
      console.error('❌ Error clearing local storage:', storageError);
    }
    
    // Clear state
    console.log('🔄 Clearing auth state...');
    setUser(null);
    setToken(null);
    console.log('✅ Logout completed');
  };

  const clearAllData = async () => {
    try {
      console.log('🧹 Clearing all stored data...');
      
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      console.log('✅ All AsyncStorage data cleared');
      
      // Clear auth state
      setUser(null);
      setToken(null);
      console.log('✅ Auth state cleared');
      
      console.log('✅ All data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing all data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, clearAllData, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}