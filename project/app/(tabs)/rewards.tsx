import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Award, Lock, Star, MapPin, Utensils, Camera, Compass, Trophy, Clock } from 'lucide-react-native';

// Mock user authentication state
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, user, login, logout };
};

// Mock user stats that would come from a database
const getUserStats = (userId) => {
  if (!userId) return { badgesEarned: 0, placesVisited: 0, totalBadges: 12, completionPercentage: 0 };
  
  return {
    badgesEarned: 4,
    placesVisited: 7,
    totalBadges: 12,
    completionPercentage: 33,
    recentActivity: [
      { type: 'badge', name: 'City Explorer', date: '2025-01-15' },
      { type: 'visit', name: 'Hamilton City Hall', date: '2025-01-15' },
      { type: 'badge', name: 'Seafood Lover', date: '2025-01-17' },
    ]
  };
};

const badges = [
  {
    id: 1,
    name: 'City Explorer',
    description: 'Visited Hamilton City Hall',
    icon: MapPin,
    color: '#14B8A6',
    earned: true,
    earnedDate: '2025-01-15',
    category: 'Landmarks'
  },
  {
    id: 2,
    name: 'History Buff',
    description: 'Explored Sessions House',
    icon: Clock,
    color: '#8B5CF6',
    earned: true,
    earnedDate: '2025-01-16',
    category: 'Landmarks'
  },
  {
    id: 3,
    name: 'Street Walker',
    description: 'Strolled down Front Street',
    icon: Compass,
    color: '#F59E0B',
    earned: false,
    earnedDate: null,
    category: 'Landmarks'
  },
  {
    id: 4,
    name: 'Sacred Explorer',
    description: 'Visited Bermuda Cathedral',
    icon: Star,
    color: '#EF4444',
    earned: false,
    earnedDate: null,
    category: 'Landmarks'
  },
  {
    id: 5,
    name: 'Luxury Hunter',
    description: 'Explored Hamilton Princess Hotel',
    icon: Trophy,
    color: '#F97316',
    earned: true,
    earnedDate: '2025-01-14',
    category: 'Landmarks'
  },
  {
    id: 6,
    name: 'Fine Diner',
    description: 'Dined at The Pickled Onion',
    icon: Utensils,
    color: '#06B6D4',
    earned: false,
    earnedDate: null,
    category: 'Restaurants'
  },
  {
    id: 7,
    name: 'Seafood Lover',
    description: 'Experienced Barracuda Grill',
    icon: Utensils,
    color: '#10B981',
    earned: true,
    earnedDate: '2025-01-17',
    category: 'Restaurants'
  },
  {
    id: 8,
    name: 'Pub Crawler',
    description: 'Visited Flanagan\'s Irish Pub',
    icon: Utensils,
    color: '#84CC16',
    earned: false,
    earnedDate: null,
    category: 'Restaurants'
  },
  {
    id: 9,
    name: 'Culinary Explorer',
    description: 'Dined at Ascots Restaurant',
    icon: Utensils,
    color: '#EC4899',
    earned: false,
    earnedDate: null,
    category: 'Restaurants'
  },
  {
    id: 10,
    name: 'Traditional Taste',
    description: 'Experienced Hog Penny Pub',
    icon: Utensils,
    color: '#A855F7',
    earned: false,
    earnedDate: null,
    category: 'Restaurants'
  },
  {
    id: 11,
    name: 'Photo Master',
    description: 'Share 10 photos on social media',
    icon: Camera,
    color: '#6366F1',
    earned: false,
    earnedDate: null,
    category: 'Special'
  },
  {
    id: 12,
    name: 'Bermuda Expert',
    description: 'Complete all landmark visits',
    icon: Trophy,
    color: '#DC2626',
    earned: false,
    earnedDate: null,
    category: 'Special'
  }
];

const categories = ['All', 'Landmarks', 'Restaurants', 'Special'];

export default function RewardsScreen() {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [earnedBadgeIds] = useState(isAuthenticated ? new Set([1, 2, 5, 7]) : new Set()); // Only show earned badges if authenticated

  const filteredBadges = selectedCategory === 'All' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const userStats = getUserStats(isAuthenticated ? user?.id : null);
  const earnedBadges = isAuthenticated ? badges.filter(badge => earnedBadgeIds.has(badge.id)) : [];
  const totalBadges = badges.length;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBadgePress = (badge) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to your account to view and earn badges.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(tabs)/account') }
        ]
      );
      return;
    }

    const isEarned = earnedBadgeIds.has(badge.id);
    
    if (isEarned) {
      Alert.alert(
        `${badge.name} Badge`,
        `${badge.description}\n\nEarned on: ${formatDate(badge.earnedDate)}\nCategory: ${badge.category}`,
        [{ text: 'Great!', style: 'default' }]
      );
    } else {
      Alert.alert(
        `${badge.name} Badge`,
        `${badge.description}\n\nCategory: ${badge.category}\n\nThis badge is locked. Complete the required activity to unlock it!`,
        [
          { text: 'OK', style: 'cancel' },
          { text: 'View Location', onPress: () => Alert.alert('Navigation', 'Opening location details...') }
        ]
      );
    }
  };

  const handleCategoryPress = (category) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to your account to filter and view badges.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(tabs)/account') }
        ]
      );
      return;
    }
    setSelectedCategory(category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Digital Badges</Text>
          <Text style={styles.subtitle}>Collect badges as you explore Bermuda</Text>
        </View>

        {/* Progress Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Award size={24} color="#14B8A6" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{userStats.badgesEarned}</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Trophy size={24} color="#F59E0B" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{totalBadges}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Star size={24} color="#8B5CF6" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{userStats.completionPercentage}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressText}>{userStats.badgesEarned} of {totalBadges} badges earned</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${userStats.completionPercentage}%` }
              ]} 
            />
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryButtons}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => handleCategoryPress(category)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Badges Grid */}
        <View style={styles.badgesContainer}>
          {filteredBadges.map((badge) => {
            const IconComponent = badge.icon;
            const isEarned = earnedBadgeIds.has(badge.id);
            return (
              <TouchableOpacity 
                key={badge.id} 
                style={[
                  styles.badgeCard,
                  isEarned && styles.badgeCardEarned
                ]}
                onPress={() => handleBadgePress(badge)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.badgeIconContainer,
                  { backgroundColor: isEarned ? badge.color : '#F3F4F6' }
                ]}>
                  {isEarned ? (
                    <IconComponent size={32} color="#FFFFFF" />
                  ) : (
                    <Lock size={32} color="#9CA3AF" />
                  )}
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={[
                    styles.badgeName,
                    { color: isEarned ? '#111827' : '#9CA3AF' }
                  ]}>
                    {badge.name}
                  </Text>
                  <Text style={[
                    styles.badgeDescription,
                    { color: isEarned ? '#6B7280' : '#9CA3AF' }
                  ]}>
                    {badge.description}
                  </Text>
                  {isEarned && (
                    <Text style={styles.badgeDate}>
                      Earned on {formatDate(badge.earnedDate)}
                    </Text>
                  )}
                </View>
                <View style={styles.badgeStatus}>
                  {isEarned ? (
                    <Award size={20} color={badge.color} />
                  ) : (
                    <Lock size={20} color="#9CA3AF" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Achievement Tip */}
        <View style={styles.tipContainer}>
          <View style={styles.tipIconContainer}>
            <Trophy size={24} color="#F59E0B" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>{isAuthenticated ? 'Pro Tip!' : 'Get Started!'}</Text>
            <Text style={styles.tipText}>
              {isAuthenticated 
                ? 'Visit all landmarks and restaurants in Hamilton to unlock special badges and become a true Bermuda expert!'
                : 'Sign in to your account to start earning badges and tracking your progress as you explore Bermuda!'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  progressSection: {
    padding: 20,
  },
  progressHeader: {
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    backgroundColor: '#14B8A6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  badgesContainer: {
    padding: 20,
    gap: 16,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
    transform: [{ scale: 1 }],
  },
  badgeCardEarned: {
    borderWidth: 2,
    borderColor: '#14B8A6',
    shadowColor: '#14B8A6',
    shadowOpacity: 0.2,
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 12,
    color: '#14B8A6',
    fontWeight: '500',
  },
  badgeStatus: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContainer: {
    margin: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});