# Login API Integration Guide

This document explains how the login functionality has been integrated with your backend API.

## 🔧 **What's Been Implemented**

### **1. Updated AuthContext (`contexts/AuthContext.tsx`)**
- ✅ Replaced mock data with real API calls
- ✅ Added token management with AsyncStorage
- ✅ Added session persistence
- ✅ Enhanced error handling
- ✅ Added detailed logging for debugging

### **2. Enhanced API Service (`services/api.ts`)**
- ✅ Updated auth endpoints to match your backend structure
- ✅ Added comprehensive error handling
- ✅ Added support for different response formats
- ✅ Added automatic token injection in requests
- ✅ Added AsyncStorage integration for React Native

### **3. Improved Login Page (`app/login.tsx`)**
- ✅ Enhanced error messages based on HTTP status codes
- ✅ Added detailed console logging
- ✅ Better user feedback during login process
- ✅ Maintained existing UI/UX

## 🚀 **API Endpoints Used**

### **Login Endpoint**
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "identifier": "admin",
  "password": "admin@123",
  "role": "admin"
}

Expected Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "1",
    "identifier": "admin",
    "name": "Admin User",
    "role": "admin",
    // ... other user properties
  }
}
```

### **Logout Endpoint**
```
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

### **Token Refresh Endpoint**
```
POST /api/auth/refresh
Authorization: Bearer <token>

Response:
{
  "token": "new_jwt_token_here"
}
```

## 🔐 **Authentication Flow**

### **1. Login Process**
```typescript
// User enters credentials and clicks login
const success = await login(email, password, role);

// AuthContext calls the API
const response = await authAPI.login(email, password);

// If successful:
// - Token is stored in AsyncStorage
// - User data is stored in AsyncStorage
// - User state is updated
// - Navigation occurs based on role
```

### **2. Session Persistence**
```typescript
// On app start, AuthContext checks for existing session
const storedToken = await AsyncStorage.getItem('authToken');
const storedUser = await AsyncStorage.getItem('user');

if (storedToken && storedUser) {
  setToken(storedToken);
  setUser(JSON.parse(storedUser));
}
```

### **3. Automatic Token Injection**
```typescript
// All API requests automatically include the token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🛡️ **Error Handling**

### **HTTP Status Code Handling**
- **401 Unauthorized**: Invalid credentials
- **404 Not Found**: Login service unavailable
- **500+ Server Error**: Backend issues
- **Network Error**: Connection problems

### **User-Friendly Error Messages**
```typescript
if (error.response?.status === 401) {
  errorMessage = 'Invalid credentials. Please check your email and password.';
} else if (error.response?.status === 404) {
  errorMessage = 'Login service not found. Please check your connection.';
} else if (error.response?.status >= 500) {
  errorMessage = 'Server error. Please try again later.';
} else if (error.message?.includes('Network Error')) {
  errorMessage = 'Network error. Please check your internet connection.';
}
```

## 📱 **React Native Specific Features**

### **AsyncStorage Integration**
```typescript
// Token storage
await AsyncStorage.setItem('authToken', response.token);
await AsyncStorage.setItem('user', JSON.stringify(response.user));

// Token retrieval
const token = await AsyncStorage.getItem('authToken');

// Token removal on logout
await AsyncStorage.removeItem('authToken');
await AsyncStorage.removeItem('user');
```

### **Automatic Request Authentication**
```typescript
// All API requests automatically include the token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});
```

## 🔍 **Debugging Features**

### **Console Logging**
The integration includes comprehensive logging:

```typescript
// Login attempt
console.log('Attempting login with:', { email, role });

// API call
console.log('Making login API call with:', { email, password });

// API response
console.log('Login API response:', response.data);

// Success
console.log('Login successful for user:', response.user.name);

// Navigation
console.log('Login successful, navigating to:', selectedRole);
```

### **Error Logging**
```typescript
// API errors
console.error('Login API error:', error);
console.error('Error response:', error.response?.data);

// Component errors
console.error('Login error in component:', error);
```

## 🎯 **Backend Requirements**

### **Required Endpoints**
Your backend must implement these endpoints:

1. **POST /api/auth/login**
   - Accept email and password
   - Return JWT token and user data
   - Handle role-based authentication

2. **POST /api/auth/logout**
   - Accept Bearer token
   - Invalidate the token
   - Return success response

3. **POST /api/auth/refresh**
   - Accept Bearer token
   - Return new JWT token
   - Handle token expiration

### **Response Format Examples**

#### **Successful Login**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "identifier": "admin",
    "name": "Admin User",
    "role": "admin",
    "department": "Administration",
    "permissions": ["user_management", "points_management", "events_management"],
    "profileImage": "https://example.com/image.jpg"
  }
}
```

#### **Failed Login**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect",
  "status": 401
}
```

#### **Server Error**
```json
{
  "error": "Internal server error",
  "message": "Something went wrong on our end",
  "status": 500
}
```

## 🧪 **Testing the Integration**

### **1. Test with Real Backend**
```bash
# Test login endpoint
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"admin@123","role":"admin"}'
```

### **2. Test in App**
1. Open the app
2. Try logging in with valid credentials
3. Check console logs for API responses
4. Verify token storage and session persistence

### **3. Test Error Scenarios**
- Invalid credentials
- Network errors
- Server errors
- Missing endpoints

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file:
```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com
```

### **API Base URL**
The API base URL is configured in `services/api.ts`:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://46640a0dc9aa.ngrok-free.app';
```

## 📋 **Next Steps**

1. **Test the integration** with your actual backend
2. **Verify all endpoints** are working correctly
3. **Test error scenarios** to ensure proper handling
4. **Monitor console logs** for debugging
5. **Update other pages** to use the new API service

## 🐛 **Common Issues & Solutions**

### **Issue: "Network Error"**
**Solution**: Check your API URL and network connection

### **Issue: "Invalid credentials"**
**Solution**: Verify your backend accepts the email/password format

### **Issue: "Login service not found"**
**Solution**: Check if the `/api/auth/login` endpoint exists

### **Issue: Token not being stored**
**Solution**: Check AsyncStorage permissions and implementation

### **Issue: Session not persisting**
**Solution**: Verify AsyncStorage is working and data format is correct

The login integration is now ready to work with your backend API! 🎉 