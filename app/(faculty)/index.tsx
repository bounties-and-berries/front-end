import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Faculty } from '@/types';
import { mockAchievements, mockEvents } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import { FileText, Calendar, Users, TrendingUp, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, QrCode } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function FacultyHome() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const faculty = user as Faculty;

  const pendingApprovals = mockAchievements.filter(a => a.status === 'pending').length;
  const approvedToday = mockAchievements.filter(a => 
    a.status === 'approved' && 
    new Date(a.date).toDateString() === new Date().toDateString()
  ).length;
  const upcomingEvents = mockEvents.slice(0, 3);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Good Morning
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {faculty?.name}
            </Text>
            <Text style={[styles.department, { color: theme.colors.textSecondary }]}>
              {faculty?.department} • {faculty?.subject}
            </Text>
          </View>
          <Image
            source={{ uri: faculty?.profileImage }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* QR Code Card */}
      <View style={styles.section}>
        <GradientCard gradientColors={theme.colors.gradient.primary}>
          <View style={styles.qrCard}>
            <View style={styles.qrHeader}>
              <View>
                <Text style={styles.qrTitle}>Attendance QR Code</Text>
                <Text style={styles.qrSubtitle}>Students can scan this for attendance</Text>
              </View>
              <View style={styles.qrIcon}>
                <QrCode size={32} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeText}>{faculty?.qrCode}</Text>
            </View>
          </View>
        </GradientCard>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <AnimatedCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                <Clock size={24} color={theme.colors.warning} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {pendingApprovals}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Pending Approvals
              </Text>
            </View>
          </AnimatedCard>
          
          <AnimatedCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                <CheckCircle size={24} color={theme.colors.success} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {approvedToday}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Approved Today
              </Text>
            </View>
          </AnimatedCard>
          
          <AnimatedCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Users size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                156
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Total Students
              </Text>
            </View>
          </AnimatedCard>
        </View>
      </View>

      {/* Pending Approvals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Approval Requests
          </Text>
          <TouchableOpacity onPress={() => router.push('/(faculty)/approvals')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.approvalsList}>
          {mockAchievements.filter(a => a.status === 'pending').slice(0, 3).map((achievement) => (
            <AnimatedCard key={achievement.id} style={styles.approvalCard}>
              <View style={styles.approvalContent}>
                <View style={[styles.approvalIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                  <AlertCircle size={20} color={theme.colors.warning} />
                </View>
                <View style={styles.approvalInfo}>
                  <Text style={[styles.approvalTitle, { color: theme.colors.text }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.approvalDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                    {achievement.description}
                  </Text>
                  <Text style={[styles.approvalDate, { color: theme.colors.textSecondary }]}>
                    {new Date(achievement.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.approvalPoints}>
                  <Text style={[styles.approvalPointsText, { color: theme.colors.primary }]}>
                    +{achievement.points}
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Upcoming Events
          </Text>
          <TouchableOpacity onPress={() => router.push('/(faculty)/events')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
              Manage
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalList}>
            {upcomingEvents.map((event) => (
              <AnimatedCard key={event.id} style={styles.eventCard}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: theme.colors.text }]} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>
                    {new Date(event.date).toLocaleDateString()}
                  </Text>
                  <Text style={[styles.eventLocation, { color: theme.colors.textSecondary }]}>
                    {event.location}
                  </Text>
                  <View style={styles.eventParticipants}>
                    <Users size={14} color={theme.colors.primary} />
                    <Text style={[styles.eventParticipantsText, { color: theme.colors.primary }]}>
                      {event.currentParticipants}/{event.maxParticipants}
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(faculty)/approvals')}
          >
            <LinearGradient
              colors={theme.colors.gradient.primary}
              style={styles.actionButtonGradient}
            >
              <FileText size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Review Points</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(faculty)/events')}
          >
            <LinearGradient
              colors={theme.colors.gradient.accent}
              style={styles.actionButtonGradient}
            >
              <Calendar size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Manage Events</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  department: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  qrCard: {
    gap: 16,
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  qrSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
    marginTop: 4,
  },
  qrIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  qrCodeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  approvalsList: {
    gap: 12,
  },
  approvalCard: {
    marginBottom: 0,
  },
  approvalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  approvalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approvalInfo: {
    flex: 1,
    gap: 2,
  },
  approvalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  approvalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  approvalDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  approvalPoints: {
    alignItems: 'center',
  },
  approvalPointsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  horizontalList: {
    flexDirection: 'row',
    gap: 16,
  },
  eventCard: {
    width: 200,
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventContent: {
    gap: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  eventDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  eventLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  eventParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  eventParticipantsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
  },
  actionButtonGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});