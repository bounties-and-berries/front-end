import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers } from '@/data/mockData';
import { Student } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Search, Trophy, Medal, Award, Star, TrendingUp, Crown } from 'lucide-react-native';

export default function StudentLeaderboard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const students = mockUsers.filter(user => user.role === 'student') as Student[];
  const sortedStudents = students.sort((a, b) => b.totalPoints - a.totalPoints);
  
  const filteredStudents = sortedStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUserRank = sortedStudents.findIndex(s => s.id === user?.id) + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#FFD700" />;
      case 2:
        return <Trophy size={24} color="#C0C0C0" />;
      case 3:
        return <Medal size={24} color="#CD7F32" />;
      default:
        return <Star size={20} color={theme.colors.textSecondary} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Leaderboard"
        subtitle="See how you rank among peers"
      />

      {/* Current User Rank */}
      <View style={styles.currentRankSection}>
        <AnimatedCard style={[styles.currentRankCard, { backgroundColor: theme.colors.primary + '10' }]}>
          <View style={styles.currentRankContent}>
            <View style={styles.currentRankLeft}>
              <View style={[
                styles.currentRankBadge,
                { backgroundColor: theme.colors.primary + '20' }
              ]}>
                <Text style={[styles.currentRankNumber, { color: theme.colors.primary }]}>
                  #{currentUserRank}
                </Text>
              </View>
              <View>
                <Text style={[styles.currentRankTitle, { color: theme.colors.text }]}>
                  Your Rank
                </Text>
                <Text style={[styles.currentRankSubtitle, { color: theme.colors.textSecondary }]}>
                  Out of {students.length} students
                </Text>
              </View>
            </View>
            <View style={styles.currentRankRight}>
              <Text style={[styles.currentRankPoints, { color: theme.colors.primary }]}>
                {(user as Student)?.totalPoints}
              </Text>
              <Text style={[styles.currentRankLabel, { color: theme.colors.textSecondary }]}>
                berries
              </Text>
            </View>
          </View>
        </AnimatedCard>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search students..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podiumSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Top Performers
        </Text>
        <View style={styles.podium}>
          {sortedStudents.slice(0, 3).map((student, index) => {
            const rank = index + 1;
            return (
              <AnimatedCard key={student.id} style={[styles.podiumCard, { flex: rank === 1 ? 1.2 : 1 }]}>
                <View style={styles.podiumContent}>
                  <View style={[
                    styles.podiumRankBadge,
                    { backgroundColor: getRankColor(rank) + '20' }
                  ]}>
                    {getRankIcon(rank)}
                  </View>
                  <Image
                    source={{ uri: student.profileImage }}
                    style={[
                      styles.podiumImage,
                      rank === 1 && styles.firstPlaceImage
                    ]}
                  />
                  <Text style={[styles.podiumName, { color: theme.colors.text }]} numberOfLines={1}>
                    {student.name}
                  </Text>
                  <Text style={[styles.podiumDepartment, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {student.department}
                  </Text>
                  <View style={styles.podiumPoints}>
                    <Text style={[styles.podiumPointsText, { color: theme.colors.primary }]}>
                      {student.totalPoints}
                    </Text>
                    <Text style={[styles.podiumPointsLabel, { color: theme.colors.textSecondary }]}>
                      berries
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            );
          })}
        </View>
      </View>

      {/* Full Leaderboard */}
      <View style={styles.leaderboardSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          All Rankings
        </Text>
        
        <ScrollView 
          style={styles.leaderboardList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.leaderboardContainer}>
            {filteredStudents.map((student, index) => {
              const rank = sortedStudents.findIndex(s => s.id === student.id) + 1;
              const isCurrentUser = student.id === user?.id;
              
              return (
                <AnimatedCard 
                  key={student.id} 
                  style={[
                    styles.leaderboardCard,
                    isCurrentUser && { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary, borderWidth: 1 }
                  ]}
                >
                  <View style={styles.leaderboardContent}>
                    <View style={styles.leaderboardLeft}>
                      <View style={[
                        styles.rankBadge,
                        { backgroundColor: getRankColor(rank) + '20' }
                      ]}>
                        <Text style={[
                          styles.rankText,
                          { color: getRankColor(rank) }
                        ]}>
                          #{rank}
                        </Text>
                      </View>
                      <Image
                        source={{ uri: student.profileImage }}
                        style={styles.studentImage}
                      />
                      <View style={styles.studentInfo}>
                        <Text style={[
                          styles.studentName, 
                          { 
                            color: theme.colors.text,
                            fontFamily: isCurrentUser ? 'Inter-Bold' : 'Inter-SemiBold'
                          }
                        ]}>
                          {student.name} {isCurrentUser && '(You)'}
                        </Text>
                        <Text style={[styles.studentDepartment, { color: theme.colors.textSecondary }]}>
                          {student.department} • Year {student.year}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.leaderboardRight}>
                      <View style={styles.pointsContainer}>
                        <Text style={[styles.pointsValue, { color: theme.colors.primary }]}>
                          {student.totalPoints}
                        </Text>
                        <Text style={[styles.pointsLabel, { color: theme.colors.textSecondary }]}>
                          berries
                        </Text>
                      </View>
                      <View style={styles.trendContainer}>
                        <TrendingUp size={16} color={theme.colors.success} />
                        <Text style={[styles.trendText, { color: theme.colors.success }]}>
                          +{Math.floor(Math.random() * 20)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  currentRankSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  currentRankCard: {
    marginBottom: 0,
  },
  currentRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentRankBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentRankNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  currentRankTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  currentRankSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  currentRankRight: {
    alignItems: 'flex-end',
  },
  currentRankPoints: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  currentRankLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  podiumSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  podium: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  podiumCard: {
    marginBottom: 0,
  },
  podiumContent: {
    alignItems: 'center',
    gap: 8,
  },
  podiumRankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  firstPlaceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  podiumName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  podiumDepartment: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  podiumPoints: {
    alignItems: 'center',
    marginTop: 4,
  },
  podiumPointsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  podiumPointsLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  leaderboardSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardContainer: {
    paddingBottom: 20,
    gap: 12,
  },
  leaderboardCard: {
    marginBottom: 0,
  },
  leaderboardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  studentDepartment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  leaderboardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  pointsLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});