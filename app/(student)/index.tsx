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
import { Student } from '@/types';
import { mockEvents, mockRewards } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Trophy, Star, TrendingUp, Calendar, Gift, Home, History, Rss } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function StudentHome() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const student = user as Student;

  const popularEvents = mockEvents.slice(0, 3);
  const popularRewards = mockRewards.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Good Morning"
        subtitle={`Welcome back, ${student?.name}`}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Points Card */}
        <View style={styles.section}>
          <GradientCard gradientColors={theme.colors.gradient.primary}>
            <View style={styles.pointsCard}>
              <View style={styles.pointsHeader}>
                <View>
                  <Text style={styles.pointsLabel}>Total Berries</Text>
                  <Text style={styles.pointsValue}>{student?.totalPoints}</Text>
                </View>
                <View style={styles.trophyContainer}>
                  <Trophy size={40} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.pointsFooter}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${Math.min((student?.totalPoints || 0) / 3000 * 100, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {3000 - (student?.totalPoints || 0)} berries to next level
                </Text>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <Star size={24} color={theme.colors.accent} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>12</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Achievements
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <TrendingUp size={24} color={theme.colors.success} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  This Month
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <Gift size={24} color={theme.colors.secondary} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>3</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Redeemed
                </Text>
              </View>
            </AnimatedCard>
          </View>
        </View>

        {/* Popular Bounties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Popular Bounties
            </Text>
            <TouchableOpacity onPress={() => router.push('/(student)/events')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {popularEvents.map((event) => (
                <AnimatedCard key={event.id} style={styles.eventCard}>
                  <Image source={{ uri: event.image }} style={styles.eventImage} />
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: theme.colors.text }]} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                    <View style={styles.eventPoints}>
                      <Text style={[styles.eventPointsText, { color: theme.colors.primary }]}>
                        {event.points} berries
                      </Text>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Popular Rewards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Popular Rewards
            </Text>
            <TouchableOpacity onPress={() => router.push('/(student)/rewards')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {popularRewards.map((reward) => (
                <AnimatedCard key={reward.id} style={styles.rewardCard}>
                  <Image source={{ uri: reward.image }} style={styles.rewardImage} />
                  <View style={styles.rewardContent}>
                    <Text style={[styles.rewardTitle, { color: theme.colors.text }]} numberOfLines={2}>
                      {reward.title}
                    </Text>
                    <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {reward.description}
                    </Text>
                    <View style={styles.rewardCost}>
                      <Text style={[styles.rewardCostText, { color: theme.colors.primary }]}>
                        {reward.pointsCost} berries
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
              onPress={() => router.push('/(student)/history')}
            >
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={styles.actionButtonGradient}
              >
                <History size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>History</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(student)/myrewards')}
            >
              <LinearGradient
                colors={theme.colors.gradient.secondary}
                style={styles.actionButtonGradient}
              >
                <Gift size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>My Rewards</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(student)/request-points')}
            >
              <LinearGradient
                colors={theme.colors.gradient.accent}
                style={styles.actionButtonGradient}
              >
                <Star size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Request Berries</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(student)/feeds')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.actionButtonGradient}
              >
                <Rss size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Feeds</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pointsCard: {
    paddingVertical: 8,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  pointsValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginTop: 4,
  },
  trophyContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsFooter: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
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
  eventPoints: {
    marginTop: 4,
  },
  eventPointsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  rewardCard: {
    width: 180,
  },
  rewardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  rewardContent: {
    gap: 6,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  rewardDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  rewardCost: {
    marginTop: 4,
  },
  rewardCostText: {
    fontSize: 14,
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