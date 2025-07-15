import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { rewardAPI } from '@/services/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Gift, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react-native';

const rewardSections = ['Active', 'Claimed', 'Expired', 'Expiring Soon'];

export default function MyRewards() {
  const { theme } = useTheme();
  const [selectedSection, setSelectedSection] = useState('Active');
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadClaimedRewards = async () => {
      setLoading(true);
      try {
        const rewards = await rewardAPI.getClaimedRewards(); // Should call GET /api/reward/claimed
        setClaimedRewards(rewards);
      } catch (error) {
        console.error('Error loading claimed rewards:', error);
        Alert.alert('Error', 'Failed to load claimed rewards. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadClaimedRewards();
  }, []);

  const getFilteredRewards = () => {
    // Map backend status to UI sections if available, else show all
    switch (selectedSection) {
      case 'Active':
        return claimedRewards.filter(r => r.status === 'active');
      case 'Claimed':
        return claimedRewards.filter(r => r.status === 'claimed');
      case 'Expired':
        return claimedRewards.filter(r => r.status === 'expired');
      case 'Expiring Soon':
        return claimedRewards.filter(r => r.status === 'expiring_soon');
      default:
        return claimedRewards;
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'Active':
        return Gift;
      case 'Claimed':
        return CheckCircle;
      case 'Expired':
        return AlertTriangle;
      case 'Expiring Soon':
        return Clock;
      default:
        return Gift;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'Active':
        return theme.colors.success;
      case 'Claimed':
        return theme.colors.primary;
      case 'Expired':
        return theme.colors.error;
      case 'Expiring Soon':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <TopMenuBar title="My Rewards" />
      <View style={styles.sectionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sectionsList}>
            {rewardSections.map((section) => {
              const IconComponent = getSectionIcon(section);
              const sectionColor = getSectionColor(section);
              const isSelected = selectedSection === section;
              return (
                <TouchableOpacity
                  key={section}
                  style={[
                    styles.sectionButton,
                    {
                      backgroundColor: isSelected 
                        ? sectionColor + '20' 
                        : theme.colors.surface,
                      borderColor: isSelected ? sectionColor : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    }
                  ]}
                  onPress={() => setSelectedSection(section)}
                >
                  <IconComponent 
                    size={18} 
                    color={isSelected ? sectionColor : theme.colors.textSecondary} 
                  />
                  <Text style={[
                    styles.sectionButtonText,
                    { 
                      color: isSelected ? sectionColor : theme.colors.textSecondary,
                      fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Medium',
                    }
                  ]}>
                    {section}
                  </Text>
                  <View style={[
                    styles.sectionBadge,
                    { backgroundColor: isSelected ? sectionColor : theme.colors.textSecondary }
                  ]}>
                    <Text style={styles.sectionBadgeText}>
                      {getFilteredRewards().length}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <ScrollView style={styles.rewardsList} showsVerticalScrollIndicator={false}>
        <View style={styles.rewardsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : getFilteredRewards().length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No rewards found</Text>
            </View>
          ) : (
            getFilteredRewards().map((reward: any) => (
              <AnimatedCard key={reward.claim_id || reward.id} style={styles.rewardCard}>
                <Image source={{ uri: reward.image || reward.img_url }} style={styles.rewardImage} />
                <View style={styles.rewardContent}>
                  <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>
                    {reward.name}
                  </Text>
                  <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]}>
                    {reward.description}
                  </Text>
                  <View style={styles.rewardDetails}>
                    <View style={styles.rewardDetail}>
                      <Calendar size={16} color={theme.colors.textSecondary} />
                      <Text style={[styles.rewardDetailText, { color: theme.colors.textSecondary }]}>Claimed: {reward.claimed_on ? new Date(reward.claimed_on).toLocaleDateString() : '-'}</Text>
                    </View>
                    {reward.expiryDate && (
                      <View style={styles.rewardDetail}>
                        <Clock size={16} color={theme.colors.textSecondary} />
                        <Text style={[styles.rewardDetailText, { color: theme.colors.textSecondary }]}>Expires: {new Date(reward.expiryDate).toLocaleDateString()}</Text>
                      </View>
                    )}
                    {reward.redeemable_code && (
                      <View style={styles.rewardDetail}>
                        <Gift size={16} color={theme.colors.textSecondary} />
                        <Text style={[styles.rewardDetailText, { color: theme.colors.textSecondary }]}>Code: {reward.redeemable_code}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </AnimatedCard>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionsContainer: {
    paddingVertical: 16,
  },
  sectionsList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  sectionButtonText: {
    fontSize: 14,
  },
  sectionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  rewardsList: {
    flex: 1,
  },
  rewardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  rewardCard: {
    marginBottom: 0,
  },
  rewardImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  rewardContent: {
    gap: 12,
  },
  rewardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  rewardDetails: {
    gap: 8,
  },
  rewardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});