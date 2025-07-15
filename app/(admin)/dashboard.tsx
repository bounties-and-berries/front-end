import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { userAPI, pointsAPI, eventAPI } from '@/services/api';
import { Student } from '@/types';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { TrendingUp, Users, Award, ChartBar as BarChart3, Calendar, Activity, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const departmentFilters = ['All', 'Computer Science', 'Engineering', 'Business', 'Arts'];
const categoryFilters = ['All', 'Academic', 'Cultural', 'Volunteer', 'Attendance'];

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const studentsData = await userAPI.getStudents();
        setStudents(studentsData);
        const facultyData = await userAPI.getFaculty();
        setFaculty(facultyData);
        const eventsData = await eventAPI.getAllEvents();
        setEvents(eventsData);
        // Get all transactions for all students
        const allTransactions: any[] = [];
        for (const student of studentsData) {
          const txns = await pointsAPI.getUserTransactions(student.id);
          allTransactions.push(...txns.map(t => ({ ...t, studentId: student.id, studentName: student.name, department: student.department })));
        }
        setTransactions(allTransactions);
      } catch (err: any) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPoints = transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + (t.points || 0), 0);
  const avgPointsPerStudent = students.length > 0 ? Math.round(totalPoints / students.length) : 0;
  const activeEvents = events.length;
  const completedEvents = events.filter(e => new Date(e.date) < new Date()).length;

  // Department stats (aggregate from students)
  const departmentStats = ['Computer Science', 'Engineering', 'Business', 'Arts'].map(name => {
    const deptStudents = students.filter(s => s.department === name);
    const deptPoints = deptStudents.reduce((sum, s) => sum + (s.totalPoints || 0), 0);
    return { name, students: deptStudents.length, points: deptPoints };
  });

  // Filter transactions based on selected category
  const filteredTransactions = transactions.filter(t => {
    if (t.type !== 'earned') return false;
    if (selectedCategory === 'All') return true;
    return t.category && t.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Analytics Dashboard"
        subtitle="College-wide performance insights"
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <AnimatedCard style={{ margin: 20, padding: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text }}>Loading dashboard...</Text>
          </AnimatedCard>
        ) : error ? (
          <AnimatedCard style={{ margin: 20, padding: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          </AnimatedCard>
        ) : (
          <>
            {/* Overview Cards */}
            <View style={styles.section}>
              <GradientCard gradientColors={theme.colors.gradient.primary}>
                <View style={styles.overviewCard}>
                  <View style={styles.overviewHeader}>
                    <Text style={styles.overviewTitle}>System Overview</Text>
                    <BarChart3 size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.overviewGrid}>
                    <View style={styles.overviewStat}>
                      <Text style={styles.overviewStatValue}>{students.length}</Text>
                      <Text style={styles.overviewStatLabel}>Total Students</Text>
                    </View>
                    <View style={styles.overviewStat}>
                      <Text style={styles.overviewStatValue}>{faculty.length}</Text>
                      <Text style={styles.overviewStatLabel}>Faculty Members</Text>
                    </View>
                    <View style={styles.overviewStat}>
                      <Text style={styles.overviewStatValue}>{totalPoints.toLocaleString()}</Text>
                      <Text style={styles.overviewStatLabel}>Total Berries</Text>
                    </View>
                    <View style={styles.overviewStat}>
                      <Text style={styles.overviewStatValue}>{avgPointsPerStudent}</Text>
                      <Text style={styles.overviewStatLabel}>Avg per Student</Text>
                    </View>
                  </View>
                </View>
              </GradientCard>
            </View>

            {/* Key Metrics */}
            <View style={styles.section}>
              <View style={styles.metricsGrid}>
                <AnimatedCard style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <View style={[styles.metricIcon, { backgroundColor: theme.colors.success + '20' }]}> 
                      <TrendingUp size={20} color={theme.colors.success} />
                    </View>
                    <Text style={[styles.metricValue, { color: theme.colors.text }]}> 
                      1250
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}> 
                      Berries Redeemed
                    </Text>
                  </View>
                </AnimatedCard>
                
                <AnimatedCard style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <View style={[styles.metricIcon, { backgroundColor: theme.colors.primary + '20' }]}> 
                      <Activity size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.metricValue, { color: theme.colors.text }]}> 
                      89%
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}> 
                      Active Users
                    </Text>
                  </View>
                </AnimatedCard>
                
                <AnimatedCard style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <View style={[styles.metricIcon, { backgroundColor: theme.colors.accent + '20' }]}> 
                      <Calendar size={20} color={theme.colors.accent} />
                    </View>
                    <Text style={[styles.metricValue, { color: theme.colors.text }]}> 
                      {activeEvents}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}> 
                      Active Bounties
                    </Text>
                  </View>
                </AnimatedCard>
                
                <AnimatedCard style={styles.metricCard}>
                  <View style={styles.metricContent}>
                    <View style={[styles.metricIcon, { backgroundColor: theme.colors.secondary + '20' }]}> 
                      <Target size={20} color={theme.colors.secondary} />
                    </View>
                    <Text style={[styles.metricValue, { color: theme.colors.text }]}> 
                      {completedEvents}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}> 
                      Completed
                    </Text>
                  </View>
                </AnimatedCard>
              </View>
            </View>
          </>
        )}
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
  overviewCard: {
    gap: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  overviewStat: {
    alignItems: 'center',
    gap: 4,
    width: '45%',
  },
  overviewStatValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  overviewStatLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 64) / 2,
  },
  metricContent: {
    alignItems: 'center',
    gap: 8,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  departmentList: {
    gap: 12,
  },
  departmentCard: {
    marginBottom: 0,
  },
  departmentContent: {
    gap: 12,
  },
  departmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  departmentStudents: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  departmentStats: {
    alignItems: 'center',
  },
  departmentPoints: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  departmentPointsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  departmentProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    marginBottom: 0,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 2,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionPoints: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
});