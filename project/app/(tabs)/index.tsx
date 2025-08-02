import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, Calendar, Clock, Bus, Ship, ExternalLink } from 'lucide-react-native';

const dailyLandmarks = [
  {
    id: 1,
    name: 'Royal Naval Dockyard',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Historic naval base with shops, museums, and dining',
    timeToVisit: '2-3 hours'
  },
  {
    id: 2,
    name: 'Horseshoe Bay Beach',
    image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'World-famous pink sand beach',
    timeToVisit: '3-4 hours'
  },
  {
    id: 3,
    name: 'Crystal Caves',
    image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Underground limestone caves with crystal formations',
    timeToVisit: '1-2 hours'
  }
];

const ongoingEvents = [
  {
    id: 1,
    title: 'Bermuda Festival of the Arts',
    date: 'Jan 15 - Feb 28',
    location: 'City of Hamilton',
    type: 'Cultural'
  },
  {
    id: 2,
    title: 'Cup Match Cricket',
    date: 'Jul 31 - Aug 1',
    location: 'Somerset Cricket Club',
    type: 'Sports'
  },
  {
    id: 3,
    title: 'Bermuda Day Parade',
    date: 'May 24',
    location: 'Hamilton to St. George',
    type: 'Cultural'
  }
];

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const getNextDeparture = (baseTime, frequency) => {
  const now = new Date();
  const [time, period] = baseTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let nextHour = period === 'PM' && hours !== 12 ? hours + 12 : hours;
  if (period === 'AM' && hours === 12) nextHour = 0;
  
  const nextDeparture = new Date();
  nextDeparture.setHours(nextHour, minutes, 0, 0);
  
  // If the time has passed, add frequency minutes
  while (nextDeparture <= now) {
    nextDeparture.setMinutes(nextDeparture.getMinutes() + parseInt(frequency));
  }
  
  return nextDeparture.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const busSchedule = [
  { 
    route: 'Route 1', 
    destination: 'Hamilton - Dockyard', 
    baseTime: '6:00 AM', 
    frequency: 15,
    status: 'On Time'
  },
  { 
    route: 'Route 2', 
    destination: 'Hamilton - St. George', 
    baseTime: '6:15 AM', 
    frequency: 20,
    status: 'On Time'
  },
  { 
    route: 'Route 3', 
    destination: 'Hamilton - South Shore', 
    baseTime: '6:30 AM', 
    frequency: 25,
    status: 'Delayed 5 min'
  }
];

const ferrySchedule = [
  { 
    route: 'Hamilton - Dockyard', 
    baseTime: '6:45 AM', 
    frequency: 20,
    status: 'On Time'
  },
  { 
    route: 'Hamilton - St. George', 
    baseTime: '7:00 AM', 
    frequency: 60,
    status: 'On Time'
  },
  { 
    route: 'Dockyard - St. George', 
    baseTime: '8:00 AM', 
    frequency: 90,
    status: 'On Time'
  }
];

export default function HomeScreen() {
  const [selectedTransport, setSelectedTransport] = useState('bus');
  const [pressedCard, setPressedCard] = useState(null);
  const [pressedEvent, setPressedEvent] = useState(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLandmarkPress = (landmark) => {
    setPressedCard(landmark.id);
    setTimeout(() => setPressedCard(null), 150);
    
    Alert.alert(
      landmark.name,
      `${landmark.description}\n\nEstimated visit time: ${landmark.timeToVisit}\n\nWould you like to get directions or learn more?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Get Directions', onPress: () => handleGetDirections(landmark) },
        { text: 'Learn More', onPress: () => router.push('/explore') }
      ]
    );
  };

  const handleEventPress = (event) => {
    setPressedEvent(event.id);
    setTimeout(() => setPressedEvent(null), 150);
    
    Alert.alert(
      event.title,
      `Date: ${event.date}\nLocation: ${event.location}\nType: ${event.type}\n\nWould you like to add this event to your calendar or get more information?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to Calendar', onPress: () => handleAddToCalendar(event) },
        { text: 'More Info', onPress: () => handleEventInfo(event) }
      ]
    );
  };

  const handleGetDirections = (landmark) => {
    Alert.alert('Directions', `Opening directions to ${landmark.name}...`);
  };

  const handleAddToCalendar = (event) => {
    Alert.alert('Calendar', `Adding "${event.title}" to your calendar...`);
  };

  const handleEventInfo = (event) => {
    Alert.alert('Event Details', `Loading more information about "${event.title}"...`);
  };

  const handleSchedulePress = (schedule, type) => {
    const nextTime = getNextDeparture(schedule.baseTime, schedule.frequency);
    const message = type === 'bus' 
      ? `${schedule.route} - ${schedule.destination}\nNext departure: ${nextTime}\nFrequency: Every ${schedule.frequency} min\nStatus: ${schedule.status}`
      : `${schedule.route}\nNext departure: ${nextTime}\nFrequency: Every ${schedule.frequency} min\nStatus: ${schedule.status}`;
    
    Alert.alert(
      `${type === 'bus' ? 'Bus' : 'Ferry'} Schedule`,
      message + '\n\nWould you like to set a reminder or view the full schedule online?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Reminder', onPress: () => Alert.alert('Reminder', 'Reminder set successfully!') },
        { text: 'Full Schedule', onPress: () => handleViewFullSchedule(type) }
      ]
    );
  };

  const handleViewFullSchedule = async (type) => {
    const url = type === 'bus' 
      ? 'https://www.gov.bm/department/public-transportation'
      : 'https://www.seaexpress.bm/schedules';
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open the schedule website');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open the schedule website');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BermudaGo</Text>
          <Text style={styles.subtitle}>Discover Bermuda's Hidden Treasures</Text>
        </View>

        {/* Daily Landmarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Landmarks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {dailyLandmarks.map((landmark) => (
              <TouchableOpacity 
                key={landmark.id} 
                style={[
                  styles.landmarkCard,
                  pressedCard === landmark.id && styles.cardPressed
                ]}
                onPress={() => handleLandmarkPress(landmark)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: landmark.image }} style={styles.landmarkImage} />
                <View style={styles.landmarkInfo}>
                  <Text style={styles.landmarkName}>{landmark.name}</Text>
                  <Text style={styles.landmarkDescription}>{landmark.description}</Text>
                  <View style={styles.timeContainer}>
                    <Clock size={14} color="#14B8A6" />
                    <Text style={styles.timeText}>{landmark.timeToVisit}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ongoing Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ongoing Events</Text>
          {ongoingEvents.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              style={[
                styles.eventCard,
                pressedEvent === event.id && styles.cardPressed
              ]}
              onPress={() => handleEventPress(event)}
              activeOpacity={0.7}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>{event.type}</Text>
                </View>
              </View>
              <View style={styles.eventDetails}>
                <View style={styles.eventDetail}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.eventDetailText}>{event.date}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transportation Schedule */}
        <View style={styles.section}>
          <View style={styles.transportHeader}>
            <Text style={styles.sectionTitle}>Transportation</Text>
            <View style={styles.liveTimeContainer}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveTimeText}>Live • {currentTime}</Text>
            </View>
          </View>
          <View style={styles.transportTabs}>
            <TouchableOpacity 
              style={[
                styles.transportTab, 
                selectedTransport === 'bus' && styles.transportTabActive
              ]}
              onPress={() => setSelectedTransport('bus')}
              activeOpacity={0.7}
            >
              <Bus size={20} color={selectedTransport === 'bus' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.transportTabText, selectedTransport === 'bus' && styles.transportTabTextActive]}>
                Bus
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.transportTab, 
                selectedTransport === 'ferry' && styles.transportTabActive
              ]}
              onPress={() => setSelectedTransport('ferry')}
              activeOpacity={0.7}
            >
              <Ship size={20} color={selectedTransport === 'ferry' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.transportTabText, selectedTransport === 'ferry' && styles.transportTabTextActive]}>
                Ferry
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTransport === 'bus' ? (
            <View style={styles.scheduleContainer}>
              <TouchableOpacity 
                style={styles.fullScheduleButton}
                onPress={() => handleViewFullSchedule('bus')}
                activeOpacity={0.7}
              >
                <Text style={styles.fullScheduleText}>View Full Bus Schedule</Text>
                <ExternalLink size={16} color="#14B8A6" />
              </TouchableOpacity>
              {busSchedule.map((schedule, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.scheduleItem}
                  onPress={() => handleSchedulePress(schedule, 'bus')}
                  activeOpacity={0.7}
                >
                  <View style={styles.scheduleLeft}>
                    <Text style={styles.scheduleRoute}>{schedule.route}</Text>
                    <Text style={styles.scheduleDestination}>{schedule.destination}</Text>
                    <Text style={[
                      styles.scheduleStatus,
                      { color: schedule.status.includes('Delayed') ? '#EF4444' : '#10B981' }
                    ]}>
                      {schedule.status}
                    </Text>
                  </View>
                  <View style={styles.scheduleRight}>
                    <Text style={styles.scheduleTime}>
                      {getNextDeparture(schedule.baseTime, schedule.frequency)}
                    </Text>
                    <Text style={styles.scheduleFrequency}>Every {schedule.frequency} min</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.scheduleContainer}>
              <TouchableOpacity 
                style={styles.fullScheduleButton}
                onPress={() => handleViewFullSchedule('ferry')}
                activeOpacity={0.7}
              >
                <Text style={styles.fullScheduleText}>View Full Ferry Schedule</Text>
                <ExternalLink size={16} color="#14B8A6" />
              </TouchableOpacity>
              {ferrySchedule.map((schedule, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.scheduleItem}
                  onPress={() => handleSchedulePress(schedule, 'ferry')}
                  activeOpacity={0.7}
                >
                  <View style={styles.scheduleLeft}>
                    <Text style={styles.scheduleRoute}>Ferry</Text>
                    <Text style={styles.scheduleDestination}>{schedule.route}</Text>
                    <Text style={[
                      styles.scheduleStatus,
                      { color: schedule.status.includes('Delayed') ? '#EF4444' : '#10B981' }
                    ]}>
                      {schedule.status}
                    </Text>
                  </View>
                  <View style={styles.scheduleRight}>
                    <Text style={styles.scheduleTime}>
                      {getNextDeparture(schedule.baseTime, schedule.frequency)}
                    </Text>
                    <Text style={styles.scheduleFrequency}>Every {schedule.frequency} min</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  landmarkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.05,
  },
  landmarkImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  landmarkInfo: {
    padding: 16,
  },
  landmarkName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  landmarkDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#14B8A6',
    marginLeft: 6,
    fontWeight: '500',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  eventBadge: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eventDetails: {
    gap: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  transportTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  transportTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  transportTabActive: {
    backgroundColor: '#14B8A6',
  },
  transportTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  transportTabTextActive: {
    color: '#FFFFFF',
  },
  scheduleContainer: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleLeft: {
    flex: 1,
  },
  scheduleRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  scheduleDestination: {
    fontSize: 14,
    color: '#6B7280',
  },
  scheduleRight: {
    alignItems: 'flex-end',
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14B8A6',
    marginBottom: 4,
  },
  scheduleFrequency: {
    fontSize: 12,
    color: '#6B7280',
  },
  transportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveTimeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  fullScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  fullScheduleText: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: '500',
  },
  scheduleStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});