import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendedPeople, likePerson, dislikePerson } from '../services/api';

const MainScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const swipeThreshold = screenWidth / 4;
  const cardWidth = Math.min(screenWidth * 0.93, 430);
  const cardHeight = Math.min(screenHeight * 0.75, 720);
  const actionSize = Math.max(58, Math.min(70, screenWidth * 0.16));

  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > swipeThreshold) {
          forceSwipe('right');
        } else if (gesture.dx < -swipeThreshold) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['recommendedPeople'],
    queryFn: () => getRecommendedPeople(10),
  });

  const likeMutation = useMutation({
    mutationFn: likePerson,
    onSuccess: () => {
      queryClient.invalidateQueries(['recommendedPeople']);
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: dislikePerson,
    onSuccess: () => {
      queryClient.invalidateQueries(['recommendedPeople']);
    },
  });

  useEffect(() => {
    if (data && data.data.length === 0 && !isLoading) {
      console.log("No more recommended people.");
    }
  }, [data, isLoading]);

  useEffect(() => {
    setCurrentIndex(0); // Reset index when new data arrives
    position.setValue({ x: 0, y: 0 }); // Reset card position
  }, [data]);

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? screenWidth : -screenWidth;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const currentPerson = data?.data[currentIndex];
    if (currentPerson) {
      if (direction === 'right') {
        likeMutation.mutate(currentPerson.id);
      } else {
        dislikeMutation.mutate(currentPerson.id);
      }
    }
    setHistory((prev) => [...prev, currentIndex]);
    position.setValue({ x: 0, y: 0 }); // Reset position for next card
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const handleRewind = () => {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const newHistory = prev.slice(0, -1);
      setCurrentIndex(Math.max(currentIndex - 1, 0));
      position.setValue({ x: 0, y: 0 });
      return newHistory;
    });
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-screenWidth / 2, 0, screenWidth / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate },
      ],
    };
  };

  const getLikeOpacity = () => {
    return position.x.interpolate({
      inputRange: [0, swipeThreshold],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  };

  const getNopeOpacity = () => {
    return position.x.interpolate({
      inputRange: [-swipeThreshold, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading recommended people...</Text>
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

  const currentPerson = data?.data[currentIndex];

  if (!currentPerson) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noMoreText}>No more people to show!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LikedTab')}>
          <Text style={styles.buttonText}>View Liked People</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {
            setCurrentIndex(0);
            queryClient.invalidateQueries(['recommendedPeople']);
          }}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCards = () => {
    return data.data.map((person, i) => {
      if (i < currentIndex) return null; // Don't render cards that have been swiped

      if (i === currentIndex) {
        return (
          <Animated.View
            key={person.id}
            style={[
              styles.card,
              { width: cardWidth, height: cardHeight },
              getCardStyle(),
            ]}
            {...panResponder.panHandlers}
          >
            <Image source={{ uri: person.pictures[0] }} style={styles.cardImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            />
            <View style={styles.cardInfo}>
              <View style={styles.badgeRow}>
                <View style={styles.activeBadge}>
                  <Ionicons name="ellipse" size={10} color="#5cf096" />
                  <Text style={styles.activeText}>Active now</Text>
                </View>
              </View>
              <Animated.View style={[styles.likeBox, { opacity: getLikeOpacity() }]}>
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.nopeBox, { opacity: getNopeOpacity() }]}>
                <Text style={styles.nopeText}>NOPE</Text>
              </Animated.View>
              <Text style={styles.cardName}>{person.name}, {person.age}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-sharp" size={18} color="#fff" />
                  <Text style={styles.cardLocation}>{person.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="navigate" size={16} color="#fff" />
                  <Text style={styles.cardLocation}>Nearby</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        );
      }
      return (
        <View
          key={person.id}
            style={[
            styles.card,
            {
              width: cardWidth,
              height: cardHeight,
              top: 10 * (i - currentIndex),
              transform: [{ scale: 0.95 - (i - currentIndex) * 0.05 }],
            },
          ]}
        >
          <Image source={{ uri: person.pictures[0] }} style={styles.cardImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{person.name}, {person.age}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-sharp" size={18} color="#fff" />
                <Text style={styles.cardLocation}>{person.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="navigate" size={16} color="#fff" />
                <Text style={styles.cardLocation}>Nearby</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }).reverse(); // Render cards in reverse order so the current card is on top
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/tinder.png')} style={styles.headerLogo} />
        </View>

        <View style={[styles.cardStack, { marginBottom: actionSize + 60 }]}>
          {renderCards()}
        </View>

        <View style={[styles.actions, { bottom: Math.max(22, screenHeight * 0.04), columnGap: 16 }]}>
          <TouchableOpacity style={[styles.actionButton, styles.rewindButton, { width: actionSize, height: actionSize, borderRadius: actionSize / 2 }]} onPress={handleRewind} disabled={!history.length}>
            <Ionicons name="refresh" size={26} color={history.length ? '#ffae42' : '#d6d6d6'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.nopeButton, { width: actionSize, height: actionSize, borderRadius: actionSize / 2 }]} onPress={() => forceSwipe('left')}>
            <Ionicons name="close" size={32} color="#FD2D55" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.likeButton, { width: actionSize, height: actionSize, borderRadius: actionSize / 2 }]} onPress={() => forceSwipe('right')}>
            <Ionicons name="heart" size={32} color="#2dd36f" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    paddingTop: 0,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  header: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    position: 'absolute',
    top: 0,
    zIndex: 2,
    elevation: 1,
  },
  headerLogo: {
    width: 110,
    height: 34,
    resizeMode: 'contain',
  },
  cardStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    position: 'absolute',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    bottom: 20,
    left: 18,
    right: 18,
  },
  cardName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  cardLocation: {
    fontSize: 16,
    color: '#f0f0f0',
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
    backgroundColor: 'rgba(92, 240, 150, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(92, 240, 150, 0.5)',
  },
  activeText: {
    color: '#e6fff0',
    marginLeft: 6,
    fontWeight: '600',
  },
  likeBox: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderColor: '#2dd36f',
    borderWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    transform: [{ rotate: '-16deg' }],
    zIndex: 3,
    pointerEvents: 'none',
    },
  likeText: {
    color: '#2dd36f',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nopeBox: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderColor: '#fd2d55',
    borderWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    transform: [{ rotate: '16deg' }],
    zIndex: 3,
    pointerEvents: 'none',
  },
  nopeText: {
    color: '#fd2d55',
    fontSize: 32,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 26,
    zIndex: 1,
    columnGap: 16,
  },
  actionButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  rewindButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ffeccf',
  },
  nopeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ffe1e7',
  },
  likeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d6f5e1',
  },
  noMoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FD2D55',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;
