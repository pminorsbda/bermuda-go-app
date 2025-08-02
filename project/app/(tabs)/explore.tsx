import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, Star, Award } from 'lucide-react-native';

const hamiltonLandmarks = [
  {
    id: 1,
    name: 'Hamilton City Hall',
    type: 'landmark',
    image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Historic government building serving as the seat of Hamilton Corporation',
    history: 'Built in 1960, Hamilton City Hall is a modernist structure that replaced the original Victorian-era building. It houses the offices of the Corporation of Hamilton and serves as the administrative center for the city. The building features distinctive Bermudian architecture with white limestone walls and a red roof.',
    visitTime: '30-45 minutes',
    rating: 4.2,
    badgeEarned: 'City Explorer'
  },
  {
    id: 2,
    name: 'Sessions House',
    type: 'landmark',
    image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Neo-Gothic parliament building housing Bermuda\'s House of Assembly',
    history: 'Completed in 1819, the Sessions House is a stunning example of neo-Gothic architecture in Bermuda. It has served as the seat of the House of Assembly since its construction. The building features a distinctive clock tower and beautiful stained glass windows. It has witnessed nearly 200 years of Bermudian political history.',
    visitTime: '45-60 minutes',
    rating: 4.6,
    badgeEarned: 'History Buff'
  },
  {
    id: 3,
    name: 'Front Street',
    type: 'landmark',
    image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Historic waterfront street lined with colonial buildings and shops',
    history: 'Front Street has been Hamilton\'s main commercial thoroughfare since the city\'s founding in 1790. Named for its position facing the harbor, it features a collection of 19th-century colonial buildings that now house shops, restaurants, and businesses. The street has been the economic heart of Bermuda for over two centuries.',
    visitTime: '1-2 hours',
    rating: 4.8,
    badgeEarned: 'Street Walker'
  },
  {
    id: 4,
    name: 'Bermuda Cathedral',
    type: 'landmark',
    image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Most Holy Trinity Cathedral, the Anglican cathedral of Bermuda',
    history: 'The Cathedral of the Most Holy Trinity was completed in 1911 and serves as the mother church of the Anglican Church of Bermuda. Built in Early English Gothic style, it features beautiful stained glass windows and a magnificent pipe organ. The cathedral replaced an earlier church that was destroyed by fire in 1884.',
    visitTime: '30-45 minutes',
    rating: 4.7,
    badgeEarned: 'Sacred Explorer'
  },
  {
    id: 5,
    name: 'Hamilton Princess Hotel',
    type: 'landmark',
    image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Historic luxury hotel known as the "Pink Palace"',
    history: 'Opened in 1885, the Hamilton Princess Hotel is Bermuda\'s oldest hotel and has hosted numerous celebrities and dignitaries. Originally built by Princess Louise, daughter of Queen Victoria, it played a significant role during both World Wars as a secret intelligence hub. The hotel\'s distinctive pink exterior has made it a Bermuda landmark.',
    visitTime: '1 hour',
    rating: 4.5,
    badgeEarned: 'Luxury Hunter'
  }
];

const hamiltonRestaurants = [
  {
    id: 6,
    name: 'The Pickled Onion',
    type: 'restaurant',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Upscale restaurant serving international cuisine in a historic setting',
    history: 'Located in a beautifully restored 19th-century building on Front Street, The Pickled Onion has been a Hamilton dining institution since 1999. The building originally served as a merchant\'s warehouse and later as offices before being converted into a restaurant. The establishment is known for its elegant atmosphere and diverse menu.',
    visitTime: '1-2 hours',
    rating: 4.4,
    badgeEarned: 'Fine Diner'
  },
  {
    id: 7,
    name: 'Barracuda Grill',
    type: 'restaurant',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Contemporary seafood restaurant with harbor views',
    history: 'Established in 1995, Barracuda Grill occupies a historic building that was once part of Hamilton\'s bustling waterfront commerce. The restaurant has become renowned for its fresh seafood and innovative cuisine. The building\'s maritime history is reflected in its nautical décor and prime harbor location.',
    visitTime: '1-2 hours',
    rating: 4.6,
    badgeEarned: 'Seafood Lover'
  },
  {
    id: 8,
    name: 'Flanagan\'s Irish Pub',
    type: 'restaurant',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Traditional Irish pub with live music and authentic atmosphere',
    history: 'Flanagan\'s opened in 1992 in a building that dates back to the early 1900s. Originally a boarding house for sailors and merchants, it was converted into Bermuda\'s first authentic Irish pub. The establishment has maintained its traditional Irish character while becoming a popular gathering place for locals and tourists alike.',
    visitTime: '2-3 hours',
    rating: 4.3,
    badgeEarned: 'Pub Crawler'
  },
  {
    id: 9,
    name: 'Ascots Restaurant',
    type: 'restaurant',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Fine dining restaurant known for European cuisine',
    history: 'Ascots has been operating since 1985 in a charming Bermudian house that was built in the 1920s. The building was originally a private residence before being converted into a restaurant. Known for its intimate atmosphere and exceptional European cuisine, Ascots has become one of Hamilton\'s most celebrated dining establishments.',
    visitTime: '2-3 hours',
    rating: 4.7,
    badgeEarned: 'Culinary Explorer'
  },
  {
    id: 10,
    name: 'Hog Penny Pub',
    type: 'restaurant',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Historic pub serving traditional British fare since 1957',
    history: 'The Hog Penny Pub opened in 1957 in a building that has been a tavern since the 1800s. Named after an old English coin, it\'s one of Bermuda\'s oldest continuously operating pubs. The building has served as a gathering place for generations of Bermudians and visitors, maintaining its authentic English pub atmosphere throughout the decades.',
    visitTime: '1-2 hours',
    rating: 4.1,
    badgeEarned: 'Traditional Taste'
  }
];

const allPlaces = [...hamiltonLandmarks, ...hamiltonRestaurants];

export default function ExploreScreen() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filter, setFilter] = useState('all');
  const [visitedPlaces, setVisitedPlaces] = useState(new Set());

  const filteredPlaces = filter === 'all' ? allPlaces : allPlaces.filter(place => place.type === filter);

  const handlePlacePress = (place) => {
    setSelectedPlace(place);
  };

  const handleBackPress = () => {
    setSelectedPlace(null);
  };

  const handleMarkAsVisited = (place) => {
    setVisitedPlaces(prev => new Set([...prev, place.id]));
    Alert.alert(
      'Congratulations!',
      `You've earned the "${place.badgeEarned}" badge for visiting ${place.name}!`,
      [{ text: 'Awesome!', onPress: () => setSelectedPlace(null) }]
    );
  };

  const handleGetDirections = (place) => {
    Alert.alert('Directions', `Opening directions to ${place.name}...`);
  };

  if (selectedPlace) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Explore</Text>
          </TouchableOpacity>
          
          <Image source={{ uri: selectedPlace.image }} style={styles.detailImage} />
          
          <View style={styles.detailContent}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{selectedPlace.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{selectedPlace.rating}</Text>
              </View>
            </View>
            
            <Text style={styles.detailDescription}>{selectedPlace.description}</Text>
            
            <View style={styles.detailMeta}>
              <View style={styles.metaItem}>
                <Clock size={16} color="#14B8A6" />
                <Text style={styles.metaText}>{selectedPlace.visitTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <Award size={16} color="#F59E0B" />
                <Text style={styles.metaText}>{selectedPlace.badgeEarned}</Text>
              </View>
            </View>
            
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>History</Text>
              <Text style={styles.historyText}>{selectedPlace.history}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => handleGetDirections(selectedPlace)}
                activeOpacity={0.7}
              >
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.visitButton,
                  visitedPlaces.has(selectedPlace.id) && styles.visitButtonVisited
                ]}
                onPress={() => handleMarkAsVisited(selectedPlace)}
                disabled={visitedPlaces.has(selectedPlace.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.visitButtonText,
                  visitedPlaces.has(selectedPlace.id) && styles.visitButtonTextVisited
                ]}>
                  {visitedPlaces.has(selectedPlace.id) ? 'Visited!' : 'Mark as Visited'}
                </Text>
                <Award size={20} color={visitedPlaces.has(selectedPlace.id) ? '#14B8A6' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Hamilton</Text>
        <Text style={styles.subtitle}>Discover landmarks and restaurants</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filter === 'landmark' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('landmark')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterButtonText, filter === 'landmark' && styles.filterButtonTextActive]}>
            Landmarks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filter === 'restaurant' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('restaurant')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterButtonText, filter === 'restaurant' && styles.filterButtonTextActive]}>
            Restaurants
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.placesGrid}>
          {filteredPlaces.map((place) => (
            <TouchableOpacity 
              key={place.id} 
              style={styles.placeCard}
              onPress={() => handlePlacePress(place)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: place.image }} style={styles.placeImage} />
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeDescription}>{place.description}</Text>
                <View style={styles.placeFooter}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.rating}>{place.rating}</Text>
                  </View>
                  <View style={styles.badgeContainer}>
                    <Award 
                      size={14} 
                      color={visitedPlaces.has(place.id) ? "#F59E0B" : "#14B8A6"}
                      fill={visitedPlaces.has(place.id) ? "#F59E0B" : "none"}
                    />
                    <Text style={styles.badgeText}>{place.badgeEarned}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#14B8A6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  placesGrid: {
    padding: 20,
    gap: 16,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  placeImage: {
    width: '100%',
    height: 200,
  },
  placeInfo: {
    padding: 16,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  placeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#14B8A6',
    fontWeight: '500',
  },
  backButton: {
    padding: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '500',
  },
  detailImage: {
    width: '100%',
    height: 300,
  },
  detailContent: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 16,
  },
  detailDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailMeta: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  historySection: {
    marginBottom: 32,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  historyText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#14B8A6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  directionsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14B8A6',
  },
  visitButton: {
    flex: 1,
    backgroundColor: '#14B8A6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  visitButtonVisited: {
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
    borderColor: '#14B8A6',
  },
  visitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  visitButtonTextVisited: {
    color: '#14B8A6',
  },
});