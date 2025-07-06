import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { mockEvents } from '@/data/mockData';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Search, Calendar, MapPin, Users, Star, Filter, Clock, CircleCheck as CheckCircle, Trophy, X } from 'lucide-react-native';

const categories = ['All', 'Academic', 'Cultural', 'Volunteer', 'Sports'];
const eventSections = ['Upcoming', 'Registered', 'Completed'];

export default function StudentEvents() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSection, setSelectedSection] = useState('Upcoming');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('All');
  
  // Mock data for different sections
  const upcomingEvents = mockEvents;
  const registeredEvents = mockEvents.slice(0, 2);
  const completedEvents = mockEvents.slice(1, 3);
  
  const getCurrentEvents = () => {
    switch (selectedSection) {
      case 'Registered':
        return registeredEvents;
      case 'Completed':
        return completedEvents;
      default:
        return upcomingEvents;
    }
  };
  
  const filteredEvents = getCurrentEvents().filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           event.category.toLowerCase() === selectedCategory.toLowerCase();
    
    let matchesDate = true;
    if (dateFilter !== 'All') {
      const eventDate = new Date(event.date);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      switch (dateFilter) {
        case 'This Week':
          matchesDate = eventDate <= nextWeek;
          break;
        case 'This Month':
          matchesDate = eventDate <= nextMonth;
          break;
        case 'Past':
          matchesDate = eventDate < today;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleRegister = (eventId: string) => {
    // Handle event registration
    console.log('Registering for event:', eventId);
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'Registered':
        return CheckCircle;
      case 'Completed':
        return Trophy;
      default:
        return Clock;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'Registered':
        return theme.colors.primary;
      case 'Completed':
        return theme.colors.success;
      default:
        return theme.colors.accent;
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setDateFilter('All');
    setSearchQuery('');
    setShowFilters(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Bounties"
        subtitle="Discover and join exciting activities"
      />

      {/* Event Sections */}
      <View style={styles.sectionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sectionsList}>
            {eventSections.map((section) => {
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
                      {getCurrentEvents().length}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search events..."
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
        </View>
      </View>

      {/* Active Filters Display */}
      {(selectedCategory !== 'All' || dateFilter !== 'All') && (
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
              {dateFilter !== 'All' && (
                <View style={[styles.activeFilter, { backgroundColor: theme.colors.secondary + '20' }]}>
                  <Text style={[styles.activeFilterText, { color: theme.colors.secondary }]}>
                    {dateFilter}
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

      {/* Events List */}
      <ScrollView 
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventsContainer}>
          {filteredEvents.map((event) => (
            <AnimatedCard key={event.id} style={styles.eventCard}>
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <View style={[
                    styles.categoryTag,
                    { backgroundColor: theme.colors.primary + '20' }
                  ]}>
                    <Text style={[styles.categoryTagText, { color: theme.colors.primary }]}>
                      {event.category}
                    </Text>
                  </View>
                  <View style={styles.pointsBadge}>
                    <Star size={12} color={theme.colors.accent} />
                    <Text style={[styles.pointsText, { color: theme.colors.accent }]}>
                      {event.points} pts
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                  {event.title}
                </Text>
                <Text style={[styles.eventDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {event.description}
                </Text>
                
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <Calendar size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <MapPin size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
                      {event.location}
                    </Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <Users size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
                      {event.currentParticipants}/{event.maxParticipants}
                    </Text>
                  </View>
                </View>
                
                {selectedSection === 'Upcoming' && (
                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => handleRegister(event.id)}
                  >
                    <Text style={styles.registerButtonText}>
                      Register Now
                    </Text>
                  </TouchableOpacity>
                )}
                
                {selectedSection === 'Registered' && (
                  <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                    <CheckCircle size={16} color={theme.colors.primary} />
                    <Text style={[styles.statusText, { color: theme.colors.primary }]}>
                      Registered
                    </Text>
                  </View>
                )}
                
                {selectedSection === 'Completed' && (
                  <View style={[styles.statusBadge, { backgroundColor: theme.colors.success + '20' }]}>
                    <Trophy size={16} color={theme.colors.success} />
                    <Text style={[styles.statusText, { color: theme.colors.success }]}>
                      Completed • +{event.points} pts
                    </Text>
                  </View>
                )}
              </View>
            </AnimatedCard>
          ))}
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
                Filter Events
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

              {/* Date Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>
                  Date Range
                </Text>
                <View style={styles.filterOptions}>
                  {['All', 'This Week', 'This Month', 'Past'].map((date) => (
                    <TouchableOpacity
                      key={date}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: dateFilter === date 
                            ? theme.colors.secondary + '20' 
                            : theme.colors.surface,
                          borderColor: dateFilter === date 
                            ? theme.colors.secondary 
                            : theme.colors.border,
                        }
                      ]}
                      onPress={() => setDateFilter(date)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { 
                          color: dateFilter === date 
                            ? theme.colors.secondary 
                            : theme.colors.text 
                        }
                      ]}>
                        {date}
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
  eventsList: {
    flex: 1,
  },
  eventsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  eventCard: {
    marginBottom: 0,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  eventContent: {
    gap: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  registerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  statusText: {
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