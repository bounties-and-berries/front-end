import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Rss, Calendar, User, Heart, MessageCircle, Share, Pin } from 'lucide-react-native';

// Mock feed data
const mockFeeds = [
  {
    id: '1',
    title: 'New Library Hours Announced',
    content: 'Starting next week, the library will be open 24/7 during exam season. Students can access study rooms and resources at any time. Please bring your student ID for entry after 10 PM.',
    author: 'Dr. Sarah Wilson',
    authorRole: 'Admin',
    authorImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    date: '2024-03-01T10:30:00Z',
    likes: 45,
    comments: 12,
    isPinned: true,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: 'Cultural Fest Registration Open',
    content: 'Get ready for the biggest cultural event of the year! Registration is now open for various competitions including dance, music, drama, and art. Prizes worth $5000 to be won!',
    author: 'Prof. Robert Smith',
    authorRole: 'Faculty',
    authorImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    date: '2024-02-28T14:15:00Z',
    likes: 89,
    comments: 23,
    isPinned: false,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'Campus WiFi Maintenance',
    content: 'The campus WiFi will undergo maintenance this Saturday from 2 AM to 6 AM. During this time, internet services may be intermittent. We apologize for any inconvenience.',
    author: 'IT Department',
    authorRole: 'Admin',
    authorImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    date: '2024-02-27T09:00:00Z',
    likes: 12,
    comments: 5,
    isPinned: false,
  },
  {
    id: '4',
    title: 'Guest Lecture on AI and Machine Learning',
    content: 'Join us for an exciting guest lecture by Dr. Emily Chen from Google AI. She will be discussing the latest trends in machine learning and career opportunities in AI. Open to all students!',
    author: 'Prof. Michael Johnson',
    authorRole: 'Faculty',
    authorImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    date: '2024-02-26T16:45:00Z',
    likes: 67,
    comments: 18,
    isPinned: false,
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function StudentFeeds() {
  const { theme } = useTheme();
  const [feeds, setFeeds] = useState(mockFeeds);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (feedId: string) => {
    setLikedPosts(prev => 
      prev.includes(feedId) 
        ? prev.filter(id => id !== feedId)
        : [...prev, feedId]
    );
    
    setFeeds(prev => 
      prev.map(feed => 
        feed.id === feedId 
          ? { 
              ...feed, 
              likes: likedPosts.includes(feedId) 
                ? feed.likes - 1 
                : feed.likes + 1 
            }
          : feed
      )
    );
  };

  const handleComment = (feedId: string) => {
    // Handle comment functionality
    console.log('Comment on feed:', feedId);
  };

  const handleShare = (feedId: string) => {
    // Handle share functionality
    console.log('Share feed:', feedId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return theme.colors.error;
      case 'faculty':
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  // Sort feeds to show pinned posts first
  const sortedFeeds = [...feeds].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Feeds"
        subtitle="Stay updated with college announcements"
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.feedsContainer}>
          {sortedFeeds.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Rss size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No Posts Yet
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  Check back later for updates from your college.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            sortedFeeds.map((feed) => (
              <AnimatedCard key={feed.id} style={styles.feedCard}>
                <View style={styles.feedContent}>
                  {/* Feed Header */}
                  <View style={styles.feedHeader}>
                    <View style={styles.authorInfo}>
                      <Image
                        source={{ uri: feed.authorImage }}
                        style={styles.authorImage}
                      />
                      <View style={styles.authorDetails}>
                        <View style={styles.authorNameRow}>
                          <Text style={[styles.authorName, { color: theme.colors.text }]}>
                            {feed.author}
                          </Text>
                          {feed.isPinned && (
                            <Pin size={14} color={theme.colors.accent} />
                          )}
                        </View>
                        <View style={styles.authorMeta}>
                          <View style={[
                            styles.roleTag,
                            { backgroundColor: getRoleColor(feed.authorRole) + '20' }
                          ]}>
                            <Text style={[
                              styles.roleText,
                              { color: getRoleColor(feed.authorRole) }
                            ]}>
                              {feed.authorRole}
                            </Text>
                          </View>
                          <Text style={[styles.feedDate, { color: theme.colors.textSecondary }]}>
                            {formatDate(feed.date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Feed Title */}
                  <Text style={[styles.feedTitle, { color: theme.colors.text }]}>
                    {feed.title}
                  </Text>

                  {/* Feed Content */}
                  <Text style={[styles.feedText, { color: theme.colors.textSecondary }]}>
                    {feed.content}
                  </Text>

                  {/* Feed Image */}
                  {feed.image && (
                    <Image
                      source={{ uri: feed.image }}
                      style={styles.feedImage}
                    />
                  )}

                  {/* Feed Actions */}
                  <View style={styles.feedActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(feed.id)}
                    >
                      <Heart 
                        size={20} 
                        color={likedPosts.includes(feed.id) ? theme.colors.error : theme.colors.textSecondary}
                        fill={likedPosts.includes(feed.id) ? theme.colors.error : 'none'}
                      />
                      <Text style={[
                        styles.actionText,
                        { 
                          color: likedPosts.includes(feed.id) 
                            ? theme.colors.error 
                            : theme.colors.textSecondary 
                        }
                      ]}>
                        {feed.likes}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleComment(feed.id)}
                    >
                      <MessageCircle size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                        {feed.comments}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleShare(feed.id)}
                    >
                      <Share size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                        Share
                      </Text>
                    </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  feedsContainer: {
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
  feedCard: {
    marginBottom: 0,
  },
  feedContent: {
    gap: 12,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorDetails: {
    flex: 1,
    gap: 2,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  feedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  feedTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 24,
  },
  feedText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  feedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  feedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});