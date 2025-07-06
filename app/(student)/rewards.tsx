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
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/types';
import { mockRewards } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Search, Gift, Star, Tag, TrendingDown, ShoppingBag, Filter, X, ArrowUpDown } from 'lucide-react-native';

const categories = ['All', 'Food', 'Merchandise', 'Discount', 'Fee'];
const expiryFilters = ['All', 'Expiring Soon', 'Valid', 'Expired'];
const sortOptions = ['Points: Low to High', 'Points: High to Low', 'Expiry Date', 'Popularity'];

export default function StudentRewards() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const student = user as Student;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExpiry, setSelectedExpiry] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Points: Low to High');
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data for claimed items and spent points
  const itemsClaimed = 8;
  const totalPointsSpent = 750;
  
  const filteredRewards = mockRewards
    .filter(reward => {
      const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           reward.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || 
                             reward.category.toLowerCase() === selectedCategory.toLowerCase();
      
      // Mock expiry logic
      let matchesExpiry = true;
      if (selectedExpiry !== 'All') {
        // This would be based on actual expiry dates in real implementation
        matchesExpiry = true;
      }
      
      return matchesSearch && matchesCategory && matchesExpiry;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'Points: Low to High':
          return a.pointsCost - b.pointsCost;
        case 'Points: High to Low':
          return b.pointsCost - a.pointsCost;
        case 'Expiry Date':
          return 0; // Would sort by actual expiry dates
        case 'Popularity':
          return 0; // Would sort by popularity metrics
        default:
          return 0;
      }
    });

  const handleClaim = (reward: any) => {
    if ((student?.totalPoints || 0) < reward.pointsCost) {
      Alert.alert(
        'Insufficient Berries',
        `You need ${reward.pointsCost - (student?.totalPoints || 0)} more berries to claim this reward.`
      );
      return;
    }
    
    Alert.alert(
      'Claim Reward',
      `Are you sure you want to claim "${reward.title}" for ${reward.pointsCost} berries?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Claim', 
          onPress: () => {
            Alert.alert('Success', 'Reward claimed successfully!');
          }
        }
      ]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedExpiry('All');
    setSelectedSort('Points: Low to High');
    setShowFilters(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Rewards"
        subtitle="Redeem your berries for exciting rewards"
      />

      {/* Points Card */}
      <View style={styles.pointsSection}>
        <GradientCard gradientColors={theme.colors.gradient.accent}>
          <View style={styles.pointsCard}>
            <Gift size={32} color="#FFFFFF" />
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Available Berries</Text>
              <Text style={styles.pointsValue}>{student?.totalPoints}</Text>
            </View>
          </View>
        </GradientCard>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <AnimatedCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <ShoppingBag size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {itemsClaimed}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Items Claimed
              </Text>
            </View>
          </AnimatedCard>
          
          <AnimatedCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.error + '20' }]}>
                <TrendingDown size={20} color={theme.colors.error} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {totalPointsSpent}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Total Berries Spent
              </Text>
            </View>
          </AnimatedCard>
        </View>
      </View>

      {/* Search and Filter Bar */}
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
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: theme.colors.secondary }]}
            onPress={() => setShowFilters(true)}
          >
            <ArrowUpDown size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters Display */}
      {(selectedCategory !== 'All' || selectedExpiry !== 'All' || selectedSort !== 'Points: Low to High') && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activeFilters}>
              {selectedCategory !== 'All' && (
                <View style={[styles.activeFilter, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Text style={[styles.activeFilterText, { color: theme.colors.primary }]}>
                    {selectedCategory}
                  </Text>
                </View>
              )}
              {selectedExpiry !== 'All' && (
                <View style={[styles.activeFilter, { backgroundColor: theme.colors.secondary + '20' }]}>
                  <Text style={[styles.activeFilterText, { color: theme.colors.secondary }]}>
                    {selectedExpiry}
                  </Text>
                </View>
              )}
              {selectedSort !== 'Points: Low to High' && (
                <View style={[styles.activeFilter, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Text style={[styles.activeFilterText, { color: theme.colors.accent }]}>
                    {selectedSort}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.clearFiltersButton, { backgroundColor: theme.colors.error + '20' }]}
                onPress={clearFilters}
              >
                <Text style={[styles.clearFiltersText, { color: theme.colors.error }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

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
                        {reward.pointsCost} berries
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

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setShowFilters(false)}
          />
          <View style={[styles.filterModal, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.filterHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
                Filter & Sort Rewards
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterContent}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>
                  Category
                </Text>
                <View style={styles.filterOptions}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: selectedCategory === category 
                            ? theme.colors.primary + '20' 
                            : theme.colors.surface,
                          borderColor: selectedCategory === category 
                            ? theme.colors.primary 
                            : theme.colors.border,
                        }
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { 
                          color: selectedCategory === category 
                            ? theme.colors.primary 
                            : theme.colors.text 
                        }
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Expiry Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>
                  Expiry Status
                </Text>
                <View style={styles.filterOptions}>
                  {expiryFilters.map((expiry) => (
                    <TouchableOpacity
                      key={expiry}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: selectedExpiry === expiry 
                            ? theme.colors.secondary + '20' 
                            : theme.colors.surface,
                          borderColor: selectedExpiry === expiry 
                            ? theme.colors.secondary 
                            : theme.colors.border,
                        }
                      ]}
                      onPress={() => setSelectedExpiry(expiry)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { 
                          color: selectedExpiry === expiry 
                            ? theme.colors.secondary 
                            : theme.colors.text 
                        }
                      ]}>
                        {expiry}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sort Options */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>
                  Sort By
                </Text>
                <View style={styles.filterOptions}>
                  {sortOptions.map((sort) => (
                    <TouchableOpacity
                      key={sort}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: selectedSort === sort 
                            ? theme.colors.accent + '20' 
                            : theme.colors.surface,
                          borderColor: selectedSort === sort 
                            ? theme.colors.accent 
                            : theme.colors.border,
                        }
                      ]}
                      onPress={() => setSelectedSort(sort)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { 
                          color: selectedSort === sort 
                            ? theme.colors.accent 
                            : theme.colors.text 
                        }
                      ]}>
                        {sort}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: theme.colors.surface }]}
                onPress={clearFilters}
              >
                <Text style={[styles.clearButtonText, { color: theme.colors.text }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
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
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  activeFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  activeFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeFilterText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearFiltersText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  filterTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});