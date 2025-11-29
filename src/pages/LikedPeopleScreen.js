import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, useWindowDimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getLikedPeople } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const LikedPeopleScreen = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const cardWidth = Math.min(screenWidth * 0.93, 430);
  const cardHeight = Math.min(screenHeight * 0.68, screenWidth * 1.05);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['likedPeople'],
    queryFn: getLikedPeople,
  });

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading liked people...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noLikedText}>No liked people yet!</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      <Image source={{ uri: item.pictures[0] }} style={styles.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.gradientOverlay}
      />
      <View style={styles.cardInfo}>
        <View style={styles.badgeRow}>
          <View style={styles.activeBadge}>
            <Ionicons name="heart" size={12} color="#e6fff0" />
            <Text style={styles.activeText}>Liked</Text>
          </View>
        </View>
        <Text style={styles.cardName}>{item.name}, {item.age}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-sharp" size={18} color="#fff" />
            <Text style={styles.cardLocation}>{item.location}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    paddingTop: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  listContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 16,
    color: '#eee',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    columnGap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 211, 111, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(45, 211, 111, 0.5)',
  },
  activeText: {
    color: '#e6fff0',
    marginLeft: 6,
    fontWeight: '600',
  },
  noLikedText: {
    fontSize: 20,
    color: '#666',
  },
});

export default LikedPeopleScreen;
