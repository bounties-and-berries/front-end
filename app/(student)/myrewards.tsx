import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { mockRewards } from '@/data/mockData';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Gift, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react-native';

const rewardSections = ['Active', 'Claimed', 'Expired', 'Expiring Soon'];

// Mock claimed rewards data
const mockClaimedRewards = [
  {
    id: '1',
    rewardId: '1',
    title: 'Free Lunch Coupon',
    description: 'Redeem for a free meal at the campus cafeteria',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimedDate: '2024-02-20',
    expiryDate: '2024-03-20',
    status: 'active',
    code: 'LUNCH2024',
  },
  {
    id: '2',
    rewardId: '2',
    title: 'College T-Shirt',
    description: 'Official college merchandise',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimedDate: '2024-02-15',
    expiryDate: '2024-02-25',
    status: 'expired',
    code: 'SHIRT2024',
  },
  {
    id: '3',
    rewardId: '4',
    title: 'Book Store Voucher',
    description: '$20 voucher for the campus bookstore',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimedDate: '2024-02-25',
    expiryDate: '2024-03-05',
    status: 'expiring_soon',
    code: 'BOOK2024',
  },
  {
    id: '4',
    rewardId: '1',
    title: 'Free Lunch Coupon',
    description: 'Redeem for a free meal at the campus cafeteria',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimedDate: '2024-01-15',
    expiryDate: '2024-02-15',
    status: 'claimed',
    code: 'LUNCH2023',
    usedDate: '2024-01-20',
  },
];

export default function MyRewards() {
  const { theme } = useTheme();
  const [selectedSection, setSelectedSection] = useState('Active');
  
  const getFilteredRewards = () => {
    switch (selectedSection) {
      case 'Active':
        return mockClaimedRewards.filter(r => r.status === 'active');
      case 'Claimed':
        return mockClaimedRewards.filter(r => r.status === 'claimed');
      case 'Expired':
        return mockClaimedRewards.filter(r => r.status === 'expired');
      case 'Expiring Soon':
        return mockClaimedRewards.filter(r => r.status === 'expiring_soon');
      default:
        return mockClaimedRewards;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'claimed':
        return theme.colors.primary;
      case 'expired':
        return theme.colors.error;
      case 'expiring_soon':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'claimed':
        return 'Used';
      case 'expired':
        return 'Expired';
      case 'expiring_soon':
        return 'Expiring Soon';
      default:
        return 'Unknown';
    }
  };

  const filteredRewards = getFilteredRewards();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="My Rewards"
        subtitle="Manage your claimed coupons and rewards"
      />

      {/* Reward Sections */}
      <View style={styles.sectionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sectionsList}>
            {rewardSections.map((section) => {
              const IconComponent = getSectionIcon(section);
              const sectionColor = getSectionColor(section);
              const isSelected = selectedSection === section;
              const count = getFilteredRewards().length;
              
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
                      {section === selectedSection ? count : mockClaimedRewards.filter(r => {
                        switch (section) {
                          case 'Active': return r.status === 'active';
                          case 'Claimed': return r.status === 'claimed';
                          case 'Expired': return r.status === 'expired';
                          case 'Expiring Soon': return r.status === 'expiring_soon';
                          default: return false;
                        }
                      }).length}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Rewards List */}
      <ScrollView 
        style={styles.rewardsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.rewardsContainer}>
          {filteredRewards.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Gift size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No {selectedSection.toLowerCase()} rewards
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  Your {selectedSection.toLowerCase()} rewards will appear here.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            filteredRewards.map((reward) => (
              <AnimatedCard key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardContent}>
                  <Image source={{ uri: reward.image }} style={styles.rewardImage} />
                  
                  <View style={styles.rewardInfo}>
                    <View style={styles.rewardHeader}>
                      <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>
                        {reward.title}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(reward.status) + '20' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(reward.status) }
                        ]}>
                          {getStatusText(reward.status)}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {reward.description}
                    </Text>
                    
                    <View style={styles.rewardDetails}>
                      <View style={styles.rewardDetail}>
                        <Calendar size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.rewardDetailText, { color: theme.colors.textSecondary }]}>
                          Claimed: {new Date(reward.claimedDate).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      <View style={styles.rewardDetail}>
                        <Clock size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.rewardDetailText, { color: theme.colors.textSecondary }]}>
                          Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      {reward.usedDate && (
                        <View style={styles.rewardDetail}>
                          <CheckCircle size={14} color={theme.colors.success} />
                          <Text style={[styles.rewardDetailText, { color: theme.colors.success }]}>
                            Used: {new Date(reward.usedDate).toLocaleDateString()}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {reward.status === 'active' && (
                      <View style={styles.codeContainer}>
                        <Text style={[styles.codeLabel, { color: theme.colors.textSecondary }]}>
                          Coupon Code:
                        </Text>
                        <View style={[styles.codeBox, { backgroundColor: theme.colors.primary + '20' }]}>
                          <Text style={[styles.codeText, { color: theme.colors.primary }]}>
                            {reward.code}
                          </Text>
                        </View>
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
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  rewardCard: {
    marginBottom: 0,
  },
  rewardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  rewardInfo: {
    flex: 1,
    gap: 8,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  rewardDetails: {
    gap: 4,
  },
  rewardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  codeContainer: {
    marginTop: 8,
    gap: 4,
  },
  codeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  codeBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  codeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
});