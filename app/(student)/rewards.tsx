import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/types';
import { mockRewards } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import { Search, Gift, Star, Tag } from 'lucide-react-native';

const categories = ['All', 'Food', 'Merchandise', 'Discount', 'Fee'];

export default function StudentRewards() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const student = user as Student;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredRewards = mockRewards.filter(reward => {
    const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           reward.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleClaim = (reward: any) => {
    if ((student?.totalPoints || 0) < reward.pointsCost) {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.pointsCost - (student?.totalPoints || 0)} more points to claim this reward.`
      );
      return;
    }
    
    Alert.alert(
      'Claim Reward',
      `Are you sure you want to claim "${reward.title}" for ${reward.pointsCost} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Claim', 
          onPress: () => {
            // Handle reward claiming logic
            Alert.alert('Success', 'Reward claimed successfully!');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Rewards
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Redeem your points for exciting rewards
        </Text>
      </View>

      {/* Points Card */}
      <View style={styles.pointsSection}>
        <GradientCard gradientColors={theme.colors.gradient.accent}>
          <View style={styles.pointsCard}>
            <Gift size={32} color="#FFFFFF" />
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Available Points</Text>
              <Text style={styles.pointsValue}>{student?.totalPoints}</Text>
            </View>
          </View>
        </GradientCard>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search rewards..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category 
                      ? theme.colors.primary 
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  { 
                    color: selectedCategory === category 
                      ? '#FFFFFF' 
                      : theme.colors.textSecondary 
                  }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Rewards List */}
      <ScrollView 
        style={styles.rewardsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.rewardsContainer}>
          {filteredRewards.map((reward) => {
            const canAfford = (student?.totalPoints || 0) >= reward.pointsCost;
            
            return (
              <AnimatedCard 
                key={reward.id} 
                style={[
                  styles.rewardCard,
                  { opacity: canAfford ? 1 : 0.6 }
                ]}
              >
                <Image source={{ uri: reward.image }} style={styles.rewardImage} />
                <View style={styles.rewardContent}>
                  <View style={styles.rewardHeader}>
                    <View style={[
                      styles.categoryTag,
                      { backgroundColor: theme.colors.secondary + '20' }
                    ]}>
                      <Tag size={12} color={theme.colors.secondary} />
                      <Text style={[styles.categoryTagText, { color: theme.colors.secondary }]}>
                        {reward.category}
                      </Text>
                    </View>
                    <Text style={[
                      styles.availabilityText, 
                      { color: theme.colors.textSecondary }
                    ]}>
                      {reward.availability} left
                    </Text>
                  </View>
                  
                  <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>
                    {reward.title}
                  </Text>
                  <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                    {reward.description}
                  </Text>
                  
                  <View style={styles.rewardFooter}>
                    <View style={styles.costContainer}>
                      <Star size={16} color={theme.colors.accent} />
                      <Text style={[styles.costText, { color: theme.colors.text }]}>
                        {reward.pointsCost} points
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.claimButton,
                        {
                          backgroundColor: canAfford 
                            ? theme.colors.primary 
                            : theme.colors.border,
                        }
                      ]}
                      onPress={() => handleClaim(reward)}
                      disabled={!canAfford}
                    >
                      <Text style={[
                        styles.claimButtonText,
                        { 
                          color: canAfford 
                            ? '#FFFFFF' 
                            : theme.colors.textSecondary 
                        }
                      ]}>
                        {canAfford ? 'Claim' : 'Need More'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedCard>
            );
          })}
        </View>
      </ScrollView>
    </View>
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
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  pointsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  pointsValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginTop: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  filterSection: {
    marginBottom: 20,
  },
  categoryList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  categoryTagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  costText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  claimButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  claimButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});