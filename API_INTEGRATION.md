# API Integration Guide

This document explains how to integrate the backend API with the React Native frontend application.

## Overview

The application has been updated to use real backend API calls instead of mock data. All API calls are centralized in the `services/api.ts` file.

## API Service Structure

### Base Configuration
- **Base URL**: Configured via `EXPO_PUBLIC_API_URL` environment variable
- **Default**: `http://localhost:3000/api`
- **Timeout**: 10 seconds
- **Headers**: JSON content type with Bearer token authentication

### Available API Modules

#### 1. Event API (`eventAPI`)
```typescript
// Get all events with optional filters
eventAPI.getAllEvents(filters?: { category?, dateRange?, search? })

// Get upcoming events
eventAPI.getUpcomingEvents()

// Get registered events for a user
eventAPI.getRegisteredEvents(userId: string)

// Get completed events for a user
eventAPI.getCompletedEvents(userId: string)

// Get event by ID
eventAPI.getEventById(eventId: string)

// Register for an event
eventAPI.registerForEvent(eventId: string, userId: string)

// Unregister from an event
eventAPI.unregisterFromEvent(eventId: string, userId: string)

// Create new event (faculty/admin only)
eventAPI.createEvent(eventData: Omit<Event, 'id'>)

// Update event (faculty/admin only)
eventAPI.updateEvent(eventId: string, eventData: Partial<Event>)

// Delete event (faculty/admin only)
eventAPI.deleteEvent(eventId: string)
```

#### 2. User API (`userAPI`)
```typescript
// Get all users (admin only)
userAPI.getAllUsers()

// Get user by ID
userAPI.getUserById(userId: string)

// Get current user profile
userAPI.getCurrentUser()

// Update user profile
userAPI.updateProfile(userId: string, profileData: Partial<User>)

// Get students (faculty/admin only)
userAPI.getStudents()

// Get faculty (admin only)
userAPI.getFaculty()
```

#### 3. Reward API (`rewardAPI`)
```typescript
// Get all rewards
rewardAPI.getAllRewards()

// Get reward by ID
rewardAPI.getRewardById(rewardId: string)

// Redeem reward
rewardAPI.redeemReward(rewardId: string, userId: string)

// Create reward (admin only)
rewardAPI.createReward(rewardData: Omit<Reward, 'id'>)

// Update reward (admin only)
rewardAPI.updateReward(rewardId: string, rewardData: Partial<Reward>)

// Delete reward (admin only)
rewardAPI.deleteReward(rewardId: string)
```

#### 4. Achievement API (`achievementAPI`)
```typescript
// Get user achievements
achievementAPI.getUserAchievements(userId: string)

// Submit achievement request
achievementAPI.submitAchievement(achievementData: Omit<Achievement, 'id'>)

// Approve/reject achievement (faculty/admin only)
achievementAPI.updateAchievementStatus(achievementId: string, status: 'approved' | 'rejected', approvedBy?: string)

// Get pending achievements (faculty/admin only)
achievementAPI.getPendingAchievements()
```

#### 5. Badge API (`badgeAPI`)
```typescript
// Get user badges
badgeAPI.getUserBadges(userId: string)

// Award badge to user (faculty/admin only)
badgeAPI.awardBadge(userId: string, badgeData: Omit<Badge, 'id'>)
```

#### 6. Points API (`pointsAPI`)
```typescript
// Get user points transactions
pointsAPI.getUserTransactions(userId: string)

// Get user total points
pointsAPI.getUserPoints(userId: string)

// Award points to user (faculty/admin only)
pointsAPI.awardPoints(userId: string, points: number, description: string, category?: string)

// Get leaderboard
pointsAPI.getLeaderboard()
```

#### 7. Notification API (`notificationAPI`)
```typescript
// Get user notifications
notificationAPI.getUserNotifications(userId: string)

// Mark notification as read
notificationAPI.markAsRead(notificationId: string)

// Mark all notifications as read
notificationAPI.markAllAsRead(userId: string)

// Delete notification
notificationAPI.deleteNotification(notificationId: string)
```

#### 8. Auth API (`authAPI`)
```typescript
// Login
authAPI.login(email: string, password: string)

// Register
authAPI.register(userData: { email, password, name, role })

// Logout
authAPI.logout()

// Refresh token
authAPI.refreshToken()
```

#### 9. QR Code API (`qrAPI`)
```typescript
// Generate QR code for attendance
qrAPI.generateAttendanceQR(eventId: string, facultyId: string)

// Scan QR code for attendance
qrAPI.scanAttendanceQR(qrCode: string, studentId: string)

// Validate QR code
qrAPI.validateQR(qrCode: string)
```

## Authentication

The API service automatically handles authentication by:
1. Adding Bearer token to request headers
2. Handling 401 unauthorized responses
3. Supporting token refresh

### Token Storage
- **Web**: Uses `localStorage`
- **React Native**: Should use `AsyncStorage` (needs to be implemented)

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- Server errors
- Authentication errors
- User-friendly error messages

## Environment Configuration

Create a `.env` file in the project root:
```env
EXPO_PUBLIC_API_URL=http://your-backend-url.com/api
```

## Usage Examples

### Loading Events
```typescript
import { eventAPI } from '@/services/api';

// In a component
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await eventAPI.getUpcomingEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  loadEvents();
}, []);
```

### Registering for an Event
```typescript
const handleRegister = async (eventId: string) => {
  try {
    await eventAPI.registerForEvent(eventId, userId);
    Alert.alert('Success', 'Successfully registered for the event!');
    // Reload events to update UI
    const updatedEvents = await eventAPI.getUpcomingEvents();
    setEvents(updatedEvents);
  } catch (error) {
    console.error('Error registering for event:', error);
    Alert.alert('Error', 'Failed to register for event');
  }
};
```

### Claiming a Reward
```typescript
const handleClaim = async (reward: Reward) => {
  if (userPoints < reward.pointsCost) {
    Alert.alert('Insufficient Points', 'You need more points to claim this reward');
    return;
  }

  try {
    await rewardAPI.redeemReward(reward.id, userId);
    Alert.alert('Success', 'Reward claimed successfully!');
    // Reload user data to update points
    const userData = await userAPI.getCurrentUser();
    setUser(userData);
  } catch (error) {
    console.error('Error claiming reward:', error);
    Alert.alert('Error', 'Failed to claim reward');
  }
};
```

## Backend Requirements

Your backend API should implement these endpoints:

### Base URL Structure
```
GET    /api/events
GET    /api/events/upcoming
GET    /api/events/registered/:userId
GET    /api/events/completed/:userId
GET    /api/events/:id
POST   /api/events/:id/register
DELETE /api/events/:id/register/:userId
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id

GET    /api/users
GET    /api/users/:id
GET    /api/users/me
PUT    /api/users/:id
GET    /api/users/students
GET    /api/users/faculty

GET    /api/rewards
GET    /api/rewards/:id
POST   /api/rewards/:id/redeem
POST   /api/rewards
PUT    /api/rewards/:id
DELETE /api/rewards/:id

GET    /api/achievements/user/:userId
POST   /api/achievements
PUT    /api/achievements/:id/status
GET    /api/achievements/pending

GET    /api/badges/user/:userId
POST   /api/badges/award/:userId

GET    /api/points/transactions/:userId
GET    /api/points/total/:userId
POST   /api/points/award/:userId
GET    /api/points/leaderboard

GET    /api/notifications/user/:userId
PUT    /api/notifications/:id/read
PUT    /api/notifications/user/:userId/read-all
DELETE /api/notifications/:id

POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh

POST   /api/qr/generate
POST   /api/qr/scan
POST   /api/qr/validate
```

### Response Formats

All API responses should follow this structure:
```typescript
// Success response
{
  data: T, // The actual data
  message?: string,
  success: true
}

// Error response
{
  error: string,
  message: string,
  success: false
}
```

## Migration from Mock Data

To migrate from mock data to API calls:

1. **Replace imports**: Change from `@/data/mockData` to `@/services/api`
2. **Add state management**: Use `useState` and `useEffect` for data loading
3. **Add loading states**: Show loading indicators during API calls
4. **Add error handling**: Handle API errors gracefully
5. **Update event handlers**: Make async calls to API instead of mock functions

## Testing

When testing the API integration:

1. **Backend not available**: The app will show error messages
2. **Network issues**: Implement retry logic if needed
3. **Authentication**: Ensure proper token handling
4. **Error states**: Test various error scenarios

## Next Steps

1. **Implement AsyncStorage**: For React Native token storage
2. **Add retry logic**: For failed network requests
3. **Implement offline support**: Cache data for offline use
4. **Add request/response interceptors**: For logging and debugging
5. **Implement real-time updates**: Using WebSockets for live data 