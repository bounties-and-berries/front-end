import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const roles = [
  { id: 'student', label: 'Student', icon: 'user' },
  { id: 'faculty', label: 'Faculty', icon: 'user' },
  { id: 'admin', label: 'Admin', icon: 'user' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Animation values
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    cardScale.value = withSpring(1, { damping: 15 });
    cardOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    try {
      console.log('Attempting login with role:', selectedRole);
      const success = await login(email, password, selectedRole);
      
      if (success) {
        console.log('Login successful, navigating to:', selectedRole);
        // Navigation will be handled by the index file based on user role
        switch (selectedRole) {
          case 'student':
            router.replace('/(student)');
            break;
          case 'faculty':
            router.replace('/(faculty)');
            break;
          case 'admin':
            router.replace('/(admin)');
            break;
          default:
            router.replace('/(student)');
        }
      } else {
        Alert.alert(
          'Login Failed', 
          'Invalid credentials. Please check your email, password, and selected role.'
        );
      }
    } catch (error: any) {
      console.error('Login error in component:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Login service not found. Please check your connection.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublicView = () => {
    router.push('/public');
  };

  const fillDemoCredentials = (role: string) => {
    setSelectedRole(role);
    setEmail(role); // Use role as identifier (admin, student, faculty)
    setPassword('admin@123'); // Use your expected password
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary as [string, string]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <Animated.View style={[styles.header, animatedCardStyle]}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.card,
                  fontSize: 30,
                  fontFamily: 'Poppins-Bold',
                  letterSpacing: 0.5,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Bounties & Berries
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.card }]}>
              Because you are more than marks!
            </Text>
          </Animated.View>

          {/* Login Card */}
          <Animated.View 
            style={[
              styles.loginCard, 
              { backgroundColor: theme.colors.card }, 
              animatedCardStyle
            ]}
          >
            {/* Role Selector */}
            <View style={styles.roleSelector}>
              <Text style={[styles.roleLabel, { color: theme.colors.text }]}>
                Login as
              </Text>
              <View style={styles.roleButtons}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.roleButton,
                      {
                        backgroundColor: selectedRole === role.id 
                          ? theme.colors.primary 
                          : theme.colors.surface,
                        borderColor: theme.colors.border,
                      }
                    ]}
                    onPress={() => setSelectedRole(role.id)}
                  >
                    <User 
                      size={18} 
                      color={selectedRole === role.id ? '#FFFFFF' : theme.colors.textSecondary} 
                    />
                    <Text style={[
                      styles.roleButtonText,
                      { 
                        color: selectedRole === role.id 
                          ? '#FFFFFF' 
                          : theme.colors.textSecondary 
                      }
                    ]}>
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Mail size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Username or Email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Lock size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Password"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={[styles.demoTitle, { color: theme.colors.textSecondary }]}>
                Quick Demo Access:
              </Text>
              <View style={styles.demoButtons}>
                <TouchableOpacity 
                  style={[styles.demoButton, { backgroundColor: theme.colors.primary + '20' }]}
                  onPress={() => fillDemoCredentials('student')}
                >
                  <Text style={[styles.demoButtonText, { color: theme.colors.primary }]}>
                    Student Demo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.demoButton, { backgroundColor: theme.colors.secondary + '20' }]}
                  onPress={() => fillDemoCredentials('faculty')}
                >
                  <Text style={[styles.demoButtonText, { color: theme.colors.secondary }]}>
                    Faculty Demo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.demoButton, { backgroundColor: theme.colors.accent + '20' }]}
                  onPress={() => fillDemoCredentials('admin')}
                >
                  <Text style={[styles.demoButtonText, { color: theme.colors.accent }]}>
                    Admin Demo
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.demoNote, { color: theme.colors.textSecondary }]}>
                All demo accounts use password: "admin@123"
              </Text>
            </View>

            {/* Login Button */}
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[styles.loginButton, { opacity: isLoading ? 0.7 : 1 }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={theme.colors.gradient.primary as [string, string]}
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.loginButtonText}>
                      Sign In
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 13,
  },
  loginCard: {
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  roleSelector: {
    marginBottom: 32,
  },
  roleLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  roleButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  demoContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  demoButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  demoNote: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  publicButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  publicButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});