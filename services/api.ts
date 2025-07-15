import axios from 'axios';
import { Event, User, Student, Faculty, Admin, Reward, Achievement, Badge, PointTransaction, Notification, BackendBounty, BackendBountyRequest, ClaimedReward } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to convert backend bounty to frontend event format
const convertBackendBountyToEvent = (backendBounty: BackendBounty): Event => {
  // Map backend type to frontend category
  let category: 'academic' | 'cultural' | 'volunteer' | 'sports';
  const backendType = backendBounty.type.toLowerCase();
  
  switch (backendType) {
    case 'academic':
    case 'education':
    case 'study':
      category = 'academic';
      break;
    case 'cultural':
    case 'culture':
    case 'arts':
      category = 'cultural';
      break;
    case 'volunteer':
    case 'volunteering':
    case 'community':
      category = 'volunteer';
      break;
    case 'sports':
    case 'sport':
    case 'athletics':
      category = 'sports';
      break;
    default:
      // Default to academic if type doesn't match known categories
      category = 'academic';
      console.log(`Unknown backend type "${backendBounty.type}", defaulting to "academic"`);
  }
  
  console.log(`Converting bounty "${backendBounty.name}": type="${backendBounty.type}" -> category="${category}"`);
  
  return {
    id: backendBounty.id.toString(),
    title: backendBounty.name,
    description: backendBounty.description,
    category: category,
    date: backendBounty.scheduled_date,
    location: backendBounty.venue,
    points: backendBounty.alloted_points,
    registrationDeadline: backendBounty.scheduled_date, // Using scheduled_date as deadline
    maxParticipants: backendBounty.capacity,
    currentParticipants: 0, // Backend doesn't provide this, defaulting to 0
    createdBy: backendBounty.created_by,
    image: backendBounty.img_url,
  };
};

// Helper function to convert frontend event to backend bounty format
const convertEventToBackendBounty = (event: Omit<Event, 'id'>): BackendBountyRequest => {
  return {
    name: event.title,
    description: event.description,
    type: event.category,
    img_url: event.image || 'http://example.com/default.jpg',
    alloted_points: event.points,
    alloted_berries: Math.floor(event.points / 10), // Convert points to berries (1 berry = 10 points)
    scheduled_date: event.date,
    venue: event.location,
    capacity: event.maxParticipants,
    is_active: true,
    created_by: event.createdBy,
    modified_by: event.createdBy,
  };
};

// Helper function to extract user info from JWT token
const extractUserFromToken = (token: string): Student | Faculty | Admin => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    console.log('JWT payload:', payload);
    
    // Extract user information from the token
    const userInfo = {
      id: payload.id || '1',
      email: payload.email || payload.username || 'user@example.com',
      name: payload.name || payload.username || 'User',
      role: payload.role || 'student',
      profileImage: payload.profileImage || undefined,
      createdAt: new Date().toISOString(),
    };
    
    // Create role-specific user object
    switch (payload.role) {
      case 'student':
        return {
          ...userInfo,
          role: 'student',
          department: payload.department || 'Computer Science',
          year: payload.year || 3,
          totalPoints: payload.totalPoints || 0,
          achievements: [],
          badges: [],
        } as Student;
        
      case 'faculty':
        return {
          ...userInfo,
          role: 'faculty',
          department: payload.department || 'Computer Science',
          subject: payload.subject || 'Data Structures',
          qrCode: payload.qrCode || `FAC_${Math.random().toString(36).substr(2, 9)}`,
        } as Faculty;
        
      case 'admin':
        return {
          ...userInfo,
          role: 'admin',
          collegeName: payload.collegeName || 'Tech University',
          permissions: payload.permissions || ['user_management', 'points_management', 'events_management'],
        } as Admin;
        
      default:
        // Default to student if role is not recognized
        return {
          ...userInfo,
          role: 'student',
          department: payload.department || 'Computer Science',
          year: payload.year || 3,
          totalPoints: payload.totalPoints || 0,
          achievements: [],
          badges: [],
        } as Student;
    }
  } catch (error) {
    console.error('Error extracting user from token:', error);
    
    // Return a default user object if token parsing fails
    return {
      id: '1',
      email: 'user@example.com',
      name: 'User',
      role: 'student',
      department: 'Computer Science',
      year: 3,
      totalPoints: 0,
      achievements: [],
      badges: [],
      createdAt: new Date().toISOString(),
    } as Student;
  }
};

// Helper function to convert backend reward to frontend Reward type
function convertBackendRewardToReward(backend: any): Reward {
  return {
    id: backend.id,
    title: backend.name,
    description: backend.description,
    category: 'merchandise', // Default or infer if needed
    pointsCost: Number(backend.berries_required),
    availability: 1, // Default, update if backend provides this
    image: backend.img_url,
    terms: undefined, // Map if available
  };
}

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://11835ccc539d.ngrok-free.app';

// Create API instance with ngrok-friendly configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for ngrok
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
    'User-Agent': 'BountiesApp/1.0', // Add user agent
  },
});

// Alternative HTTP API for testing (if HTTPS fails)
const httpApi = axios.create({
  baseURL: API_BASE_URL.replace('https://', 'http://'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'BountiesApp/1.0',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Added auth token to request:', config.url);
        console.log('🔑 Token length:', token.length);
        console.log('🔑 Token preview:', token.substring(0, 20) + '...');
      } else {
        console.log('⚠️ No auth token found for request:', config.url);
      }
      
      // Log all headers being sent
      console.log('📤 Request headers:', config.headers);
      console.log('📤 Request method:', config.method);
      console.log('📤 Request URL:', config.url);
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

// Test API connectivity
export const testAPI = {
  // Test if the API is accessible
  testConnection: async () => {
    try {
      console.log('🧪 Testing API connection...');
      console.log('🌐 API Base URL:', API_BASE_URL);
      
      const response = await api.get('/api/bounties');
      console.log('✅ API connection successful, status:', response.status);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      
      // Check if response is HTML (which would indicate wrong endpoint or auth issue)
      if (typeof response.data === 'string' && response.data.includes('<html>')) {
        console.log('⚠️ Response appears to be HTML - possible wrong endpoint or auth issue');
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error('❌ API connection failed:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Check for ngrok-specific errors
      if (error.message.includes('certificate') || error.message.includes('SSL')) {
        console.error('🔒 SSL/Certificate error - common with ngrok');
      }
      if (error.message.includes('timeout')) {
        console.error('⏰ Timeout error - ngrok can be slow');
      }
      if (error.message.includes('network')) {
        console.error('🌐 Network error - check ngrok tunnel');
      }
      
      return false;
    }
  },
  
  // Test ngrok connectivity specifically
  testNgrokConnection: async () => {
    try {
      console.log('🧪 Testing ngrok connectivity...');
      
      // Test HTTPS first
      try {
        console.log('🔒 Testing HTTPS connection...');
        const httpsResponse = await api.get('/api/bounties');
        console.log('✅ HTTPS connection successful:', httpsResponse.status);
        return { success: true, protocol: 'https', data: httpsResponse.data };
      } catch (httpsError: any) {
        console.log('❌ HTTPS failed:', httpsError.message);
        
        // Try HTTP as fallback
        try {
          console.log('🔓 Testing HTTP connection...');
          const httpResponse = await httpApi.get('/api/bounties');
          console.log('✅ HTTP connection successful:', httpResponse.status);
          return { success: true, protocol: 'http', data: httpResponse.data };
        } catch (httpError: any) {
          console.log('❌ HTTP also failed:', httpError.message);
          return { success: false, error: 'Both HTTPS and HTTP failed' };
        }
      }
    } catch (error: any) {
      console.error('❌ Ngrok connectivity test failed:', error.message);
      return { success: false, error: error.message };
    }
  },
  
  // Test different endpoint variations
  testEndpoints: async () => {
    const endpoints = [
      '/api/bounties',
      '/api/bounties?status=active',
      '/api/bounties?is_active=true',
      '/api/bounties?type=academic',
      '/api/bounties?type=cultural',
      '/api/bounties?type=volunteer',
      '/api/bounties?type=sports',
    ];
    
    console.log('🧪 Testing different endpoint variations...');
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Testing endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ Status: ${response.status}`);
        console.log(`📊 Data type: ${typeof response.data}`);
        console.log(`📊 Data length: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
        console.log(`📊 Data:`, response.data);
        
        if (response.status === 204) {
          console.log(`⚠️ 204 No Content for ${endpoint}`);
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          console.log(`✅ Found ${response.data.length} bounties in ${endpoint}`);
          return { success: true, endpoint, data: response.data };
        }
      } catch (error: any) {
        console.log(`❌ ${endpoint} failed: ${error.message}`);
        console.log(`❌ Status: ${error.response?.status}`);
        console.log(`❌ Data: ${error.response?.data}`);
      }
    }
    
    console.log('❌ All endpoints returned 204 or failed');
    return { success: false };
  },
  
  // Test if we can create a bounty (to check if database is empty)
  testCreateBounty: async () => {
    try {
      console.log('🧪 Testing bounty creation...');
      
      const testBounty = {
        name: "Test Bounty - Delete Me",
        description: "This is a test bounty to check if creation works",
        type: "academic",
        img_url: "http://example.com/test.jpg",
        alloted_points: 50,
        alloted_berries: 5,
        scheduled_date: "2024-12-31T10:00:00Z",
        venue: "Test Venue",
        capacity: 10,
        is_active: true,
        created_by: "test",
        modified_by: "test"
      };
      
      console.log('📝 Creating test bounty:', testBounty);
      const response = await api.post('/api/bounties', testBounty);
      console.log('✅ Test bounty created successfully:', response.data);
      
      // Try to delete the test bounty
      if (response.data && response.data.id) {
        console.log('🗑️ Deleting test bounty...');
        await api.delete(`/api/bounties/${response.data.id}`);
        console.log('✅ Test bounty deleted successfully');
      }
      
      return { success: true, message: 'Database is working, can create and delete bounties' };
    } catch (error: any) {
      console.error('❌ Test bounty creation failed:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      return { success: false, error: error.message };
    }
  },
  
  // Test authentication
  testAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔍 Current auth token:', token ? 'Present' : 'Missing');
      if (token) {
        console.log('🔍 Token length:', token.length);
        console.log('🔍 Token preview:', token.substring(0, 20) + '...');
        
        // Validate JWT token format
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.log('❌ Invalid JWT token format (should have 3 parts)');
          return false;
        }
        
        try {
          // Try to decode the payload
          const payload = JSON.parse(atob(parts[1]));
          console.log('🔍 Token payload:', payload);
          console.log('🔍 Token expires at:', payload.exp ? new Date(payload.exp * 1000) : 'No expiration');
          
          // Check if token is expired
          if (payload.exp && Date.now() > payload.exp * 1000) {
            console.log('❌ Token is expired');
            return false;
          }
        } catch (decodeError) {
          console.log('❌ Failed to decode JWT token:', decodeError);
          return false;
        }
        
        // Test a protected endpoint
        const response = await api.get('/api/bounties');
        console.log('✅ Auth test successful, status:', response.status);
        return true;
      } else {
        console.log('❌ No auth token found');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Auth test failed:', error.message);
      console.error('Error status:', error.response?.status);
      return false;
    }
  },
};

// Event API calls
export const eventAPI = {
  // Get all events with optional filters
  getAllEvents: async (filters?: {
    category?: string;
    dateRange?: string;
    search?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      
      // Map frontend filter names to backend parameter names
      if (filters?.category && filters.category !== 'All') {
        // Map category to type for backend
        params.append('type', filters.category);
      }
      if (filters?.search) {
        // Map search to name for backend
        params.append('name', filters.search);
      }
      if (filters?.dateRange && filters.dateRange !== 'All') {
        // Handle date range mapping
        const today = new Date();
        let dateFrom: Date | undefined;
        let dateTo: Date | undefined;
        
        switch (filters.dateRange) {
          case 'This Week':
            dateFrom = today;
            dateTo = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'This Month':
            dateFrom = today;
            dateTo = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
          case 'Past':
            dateFrom = new Date(0); // Beginning of time
            dateTo = today;
            break;
          default:
            // Don't add date filters for 'All'
            break;
        }
        
        if (dateFrom && dateTo) {
          params.append('date_from', dateFrom.toISOString().split('T')[0]);
          params.append('date_to', dateTo.toISOString().split('T')[0]);
        }
      }
      
      console.log('Making getAllEvents API call to:', `/api/bounties?${params.toString()}`);
      console.log('Mapped parameters:', Object.fromEntries(params.entries()));
      const response = await api.get(`/api/bounties?${params.toString()}`);
      
      console.log('getAllEvents response status:', response.status);
      console.log('getAllEvents response data:', response.data);
      
      // Handle 204 No Content response
      if (response.status === 204) {
        console.log('✅ Server returned 204 No Content - no bounties found');
        return [] as Event[];
      }
      
      // Handle different response formats
      const data = response.data;
      let backendBounties: BackendBounty[] = [];
      
      if (Array.isArray(data)) {
        console.log('✅ Found direct array with', data.length, 'bounties');
        backendBounties = data as BackendBounty[];
      } else if (data && Array.isArray(data.data)) {
        console.log('✅ Found data.data array with', data.data.length, 'bounties');
        backendBounties = data.data as BackendBounty[];
      } else if (data && Array.isArray(data.bounties)) {
        console.log('✅ Found data.bounties array with', data.bounties.length, 'bounties');
        backendBounties = data.bounties as BackendBounty[];
      } else {
        console.warn('❌ Unexpected getAllEvents response format:', data);
        console.warn('Available keys:', Object.keys(data || {}));
        return [] as Event[];
      }
      
      // Convert backend bounties to frontend events
      const events = backendBounties.map(convertBackendBountyToEvent);
      console.log('✅ Converted', events.length, 'bounties to events');
      return events;
    } catch (error: any) {
      console.error('Error in getAllEvents:', error);
      console.error('Error response:', error.response?.data);
      return [] as Event[];
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      // Try different endpoint variations with correct backend parameters
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const endpoints = [
        `/api/bounties?status=upcoming&date_from=${today.toISOString().split('T')[0]}&date_to=${nextMonth.toISOString().split('T')[0]}`,
        `/api/bounties?date_from=${today.toISOString().split('T')[0]}`,
        '/api/bounties?status=upcoming',
        '/api/bounties',
        '/api/events?status=upcoming',
        '/api/events'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying API call to:', endpoint);
          const response = await api.get(endpoint);
          console.log('API Response status:', response.status);
          console.log('API Response data type:', typeof response.data);
          console.log('API Response data:', response.data);
          
          // Handle 204 No Content response
          if (response.status === 204) {
            console.log('✅ Server returned 204 No Content for endpoint:', endpoint);
            return [] as Event[];
          }
          
          // Handle different response formats
          const data = response.data;
          let backendBounties: BackendBounty[] = [];
          
          if (Array.isArray(data)) {
            console.log('Found direct array with', data.length, 'bounties');
            backendBounties = data as BackendBounty[];
          } else if (data && Array.isArray(data.data)) {
            console.log('Found data.data array with', data.data.length, 'bounties');
            backendBounties = data.data as BackendBounty[];
          } else if (data && Array.isArray(data.bounties)) {
            console.log('Found data.bounties array with', data.bounties.length, 'bounties');
            backendBounties = data.bounties as BackendBounty[];
          } else if (data && typeof data === 'object') {
            console.log('Response is object, checking for events property');
            if (data.events && Array.isArray(data.events)) {
              console.log('Found data.events array with', data.events.length, 'bounties');
              backendBounties = data.events as BackendBounty[];
            }
          }
          
          if (backendBounties.length > 0) {
            // Convert backend bounties to frontend events
            const events = backendBounties.map(convertBackendBountyToEvent);
            console.log('✅ Converted', events.length, 'bounties to events');
            return events;
          }
          
          console.log('Endpoint', endpoint, 'did not return expected format');
        } catch (endpointError: any) {
          console.log('Endpoint', endpoint, 'failed:', endpointError.message);
        }
      }
      
      console.warn('All endpoints failed or returned unexpected format');
      return [] as Event[];
    } catch (error: any) {
      console.error('Error in getUpcomingEvents:', error);
      console.error('Error response:', error.response?.data);
      return [] as Event[];
    }
  },

  // Get registered events for a user
  getRegisteredEvents: async (userId: string) => {
    try {
      // Try different parameter combinations for registered events
      const endpoints = [
        `/api/bounties?status=registered&user_id=${userId}`,
        `/api/bounties?status=registered&userId=${userId}`,
        `/api/bounties?user_id=${userId}&status=registered`,
        `/api/bounties?userId=${userId}&status=registered`,
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying registered events endpoint:', endpoint);
          const response = await api.get(endpoint);
          const data = response.data;
          let backendBounties: BackendBounty[] = [];
          
          if (Array.isArray(data)) {
            backendBounties = data as BackendBounty[];
          } else if (data && Array.isArray(data.data)) {
            backendBounties = data.data as BackendBounty[];
          } else {
            console.log('Endpoint', endpoint, 'did not return expected format');
            continue;
          }
          
          if (backendBounties.length > 0) {
            const events = backendBounties.map(convertBackendBountyToEvent);
            return events;
          }
        } catch (endpointError: any) {
          console.log('Endpoint', endpoint, 'failed:', endpointError.message);
        }
      }
      
      console.warn('All registered events endpoints failed');
      return [] as Event[];
    } catch (error: any) {
      console.error('Error in getRegisteredEvents:', error);
      return [] as Event[];
    }
  },

  // Get completed events for a user
  getCompletedEvents: async (userId: string) => {
    try {
      // Try different parameter combinations for completed events
      const endpoints = [
        `/api/bounties?status=completed&user_id=${userId}`,
        `/api/bounties?status=completed&userId=${userId}`,
        `/api/bounties?user_id=${userId}&status=completed`,
        `/api/bounties?userId=${userId}&status=completed`,
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying completed events endpoint:', endpoint);
          const response = await api.get(endpoint);
          const data = response.data;
          let backendBounties: BackendBounty[] = [];
          
          if (Array.isArray(data)) {
            backendBounties = data as BackendBounty[];
          } else if (data && Array.isArray(data.data)) {
            backendBounties = data.data as BackendBounty[];
          } else {
            console.log('Endpoint', endpoint, 'did not return expected format');
            continue;
          }
          
          if (backendBounties.length > 0) {
            const events = backendBounties.map(convertBackendBountyToEvent);
            return events;
          }
        } catch (endpointError: any) {
          console.log('Endpoint', endpoint, 'failed:', endpointError.message);
        }
      }
      
      console.warn('All completed events endpoints failed');
      return [] as Event[];
    } catch (error: any) {
      console.error('Error in getCompletedEvents:', error);
      return [] as Event[];
    }
  },

  // Get event by ID
  getEventById: async (eventId: string) => {
    try {
      const response = await api.get(`/api/bounties/${eventId}`);
      const backendBounty = response.data as BackendBounty;
      const event = convertBackendBountyToEvent(backendBounty);
      return event;
    } catch (error: any) {
      console.error('Error in getEventById:', error);
      throw error;
    }
  },

  // Register for an event
  registerForEvent: async (eventId: string, userId: string) => {
    const response = await api.post(`/api/bounties/${eventId}/register`, { userId });
    return response.data;
  },

  // Unregister from an event
  unregisterFromEvent: async (eventId: string, userId: string) => {
    const response = await api.delete(`/events/${eventId}/register/${userId}`);
    return response.data;
  },

  // Create new event (for faculty/admin)
  createEvent: async (eventData: Omit<Event, 'id'>) => {
    try {
      console.log('Making createEvent API call with:', eventData);
      
      // Convert frontend event to backend bounty format
      const backendBountyData = convertEventToBackendBounty(eventData);
      console.log('Converted to backend format:', backendBountyData);
      
      const response = await api.post('/api/bounties', backendBountyData);
      console.log('createEvent response:', response.data);
      
      // Convert the response back to frontend format
      const createdBounty = response.data as BackendBounty;
      const createdEvent = convertBackendBountyToEvent(createdBounty);
      
      return createdEvent;
    } catch (error: any) {
      console.error('Error in createEvent:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update event (for faculty/admin)
  updateEvent: async (eventId: string, eventData: Partial<Event>) => {
    try {
      console.log('Making updateEvent API call for eventId:', eventId, 'with data:', eventData);
      
      // Convert frontend event to backend bounty format
      const backendBountyData = convertEventToBackendBounty(eventData as Omit<Event, 'id'>);
      console.log('Converted to backend format:', backendBountyData);
      
      const response = await api.put(`/api/bounties/${eventId}`, backendBountyData);
      console.log('updateEvent response:', response.data);
      
      // Convert the response back to frontend format
      const updatedBounty = response.data as BackendBounty;
      const updatedEvent = convertBackendBountyToEvent(updatedBounty);
      
      return updatedEvent;
    } catch (error: any) {
      console.error('Error in updateEvent:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Delete event (for faculty/admin)
  deleteEvent: async (eventId: string) => {
    try {
      console.log('Making deleteEvent API call for eventId:', eventId);
      const response = await api.delete(`/api/bounties/${eventId}`);
      console.log('deleteEvent response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error in deleteEvent:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },
};

// User API calls
export const userAPI = {
  // Get all users (for admin)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data as (Student | Faculty | Admin)[];
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data as Student | Faculty | Admin;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data as Student | Faculty | Admin;
  },

  // Update user profile
  updateProfile: async (userId: string, profileData: Partial<User>) => {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data as Student | Faculty | Admin;
  },

  // Get students (for faculty/admin)
  getStudents: async () => {
    const response = await api.get('/users/students');
    return response.data as Student[];
  },

  // Get faculty (for admin)
  getFaculty: async () => {
    const response = await api.get('/users/faculty');
    return response.data as Faculty[];
  },
};

// Reward API calls
export const rewardAPI = {
  // Get all rewards
  getAllRewards: async () => {
    // Use '/api/reward' to match backend docs and ngrok path
    const response = await api.get('/api/reward');
    console.log('Raw rewards response:', response.data); // Debug log
    return (response.data as any[]).map(convertBackendRewardToReward);
  },

  // Get reward by ID
  getRewardById: async (rewardId: string) => {
    const response = await api.get(`/api/reward/${rewardId}`);
    return convertBackendRewardToReward(response.data);
  },

  // Redeem reward
  redeemReward: async (rewardId: string, userId: string) => {
    const response = await api.post(`/api/reward/${rewardId}/redeem`, { userId });
    return response.data;
  },

  // Create reward (for admin)
  createReward: async (rewardData: Omit<Reward, 'id'>) => {
    const response = await api.post('/api/reward', rewardData);
    return response.data as Reward;
  },

  // Update reward (for admin)
  updateReward: async (rewardId: string, rewardData: Partial<Reward>) => {
    const response = await api.put(`/api/reward/${rewardId}`, rewardData);
    return response.data as Reward;
  },

  // Delete reward (for admin)
  deleteReward: async (rewardId: string) => {
    const response = await api.delete(`/api/reward/${rewardId}`);
    return response.data;
  },

  // Get claimed rewards for current user
  getClaimedRewards: async () => {
    const response = await api.get('/api/reward/claimed');
    return response.data as ClaimedReward[];
  },
};

// Achievement API calls
export const achievementAPI = {
  // Get user achievements
  getUserAchievements: async (userId: string) => {
    const response = await api.get(`/achievements/user/${userId}`);
    return response.data as Achievement[];
  },

  // Submit achievement request
  submitAchievement: async (achievementData: Omit<Achievement, 'id'>) => {
    const response = await api.post('/achievements', achievementData);
    return response.data as Achievement;
  },

  // Approve/reject achievement (for faculty/admin)
  updateAchievementStatus: async (achievementId: string, status: 'approved' | 'rejected', approvedBy?: string) => {
    const response = await api.put(`/achievements/${achievementId}/status`, { status, approvedBy });
    return response.data as Achievement;
  },

  // Get pending achievements (for faculty/admin)
  getPendingAchievements: async () => {
    const response = await api.get('/achievements/pending');
    return response.data as Achievement[];
  },
};

// Badge API calls
export const badgeAPI = {
  // Get user badges
  getUserBadges: async (userId: string) => {
    const response = await api.get(`/badges/user/${userId}`);
    return response.data as Badge[];
  },

  // Award badge to user (for faculty/admin)
  awardBadge: async (userId: string, badgeData: Omit<Badge, 'id'>) => {
    const response = await api.post(`/badges/award/${userId}`, badgeData);
    return response.data as Badge;
  },
};

// Points API calls
export const pointsAPI = {
  // Get user points transactions
  getUserTransactions: async (userId: string) => {
    const response = await api.get(`/points/transactions/${userId}`);
    return response.data as PointTransaction[];
  },

  // Get user total points
  getUserPoints: async (userId: string) => {
    const response = await api.get(`/points/total/${userId}`);
    return response.data as { totalPoints: number };
  },

  // Award points to user (for faculty/admin)
  awardPoints: async (userId: string, points: number, description: string, category?: string) => {
    const response = await api.post(`/points/award/${userId}`, { points, description, category });
    return response.data as PointTransaction;
  },

  // Get leaderboard
  getLeaderboard: async () => {
    const response = await api.get('/points/leaderboard');
    return response.data as Array<{ userId: string; name: string; totalPoints: number; rank: number }>;
  },
};

// Notification API calls
export const notificationAPI = {
  // Get user notifications
  getUserNotifications: async (userId: string) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data as Notification[];
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data as Notification;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string) => {
    const response = await api.put(`/notifications/user/${userId}/read-all`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// Auth API calls
export const authAPI = {
  // Login
  login: async (identifier: string, password: string, role: string) => {
    try {
      console.log('Making login API call with:', { identifier, password, role });
      console.log('API URL:', '/api/auth/login');
      console.log('Request body:', { identifier, password, role });
      
      const response = await api.post('/api/auth/login', { 
        name: identifier, // Pass identifier as name for backend compatibility
        password,
        role
      });
      
      console.log('Login API response:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data || {}));
      
      // Handle different response formats
      const data = response.data;
      
      // Log the exact structure
      console.log('Full response structure:', JSON.stringify(data, null, 2));
      
      if (data && data.token) {
        console.log('✅ Found token in response');
        
        // Extract user info from JWT token
        const userInfo = extractUserFromToken(data.token);
        
        return {
          token: data.token,
          user: userInfo
        } as { token: string; user: Student | Faculty | Admin };
      } else if (data && data.access_token) {
        console.log('✅ Found access_token in response');
        const userInfo = extractUserFromToken(data.access_token);
        return {
          token: data.access_token,
          user: userInfo
        } as { token: string; user: Student | Faculty | Admin };
      } else {
        console.warn('❌ Unexpected login response format:', data);
        console.warn('Available keys:', Object.keys(data || {}));
        return null;
      }
    } catch (error: any) {
      console.error('Login API error:', error);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        alert('Login failed: ' + (error.response.data?.message || JSON.stringify(error.response.data)));
      } else {
        alert('Login failed: ' + error.message);
      }
      throw error;
    }
  },

  // Register
  register: async (userData: { email: string; password: string; name: string; role: string }) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const data = response.data;
      
      if (data && data.token && data.user) {
        return data as { token: string; user: Student | Faculty | Admin };
      } else if (data && data.access_token) {
        return {
          token: data.access_token,
          user: data.user || data.userData
        } as { token: string; user: Student | Faculty | Admin };
      } else {
        console.warn('Unexpected register response format:', data);
        return null;
      }
    } catch (error: any) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      console.log('📡 Making logout API call to /api/auth/logout');
      const response = await api.post('/api/auth/logout');
      console.log('✅ Logout API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Logout API error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      // Don't throw error for logout, just log it and return success
      // This ensures logout continues even if API call fails
      return { success: true };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/api/auth/refresh');
      const data = response.data;
      
      if (data && data.token) {
        return { token: data.token };
      } else if (data && data.access_token) {
        return { token: data.access_token };
      } else {
        console.warn('Unexpected refresh response format:', data);
        return null;
      }
    } catch (error: any) {
      console.error('Refresh token API error:', error);
      throw error;
    }
  },
};

// QR Code API calls
export const qrAPI = {
  // Generate QR code for attendance
  generateAttendanceQR: async (eventId: string, facultyId: string) => {
    const response = await api.post('/qr/generate', { eventId, facultyId });
    return response.data as { qrCode: string; expiresAt: string };
  },

  // Scan QR code for attendance
  scanAttendanceQR: async (qrCode: string, studentId: string) => {
    const response = await api.post('/qr/scan', { qrCode, studentId });
    return response.data as { success: boolean; message: string };
  },

  // Validate QR code
  validateQR: async (qrCode: string) => {
    const response = await api.post('/qr/validate', { qrCode });
    return response.data as { valid: boolean; eventId?: string; facultyId?: string };
  },
};

export default api; 