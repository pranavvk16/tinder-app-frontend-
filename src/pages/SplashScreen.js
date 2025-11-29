import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Navigate to Main tab navigator and remove SplashScreen from stack
    }, 3000); // 3-second delay

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash-icon.png')} // Adjust path as needed
        style={styles.logo}
      />
      <Text style={styles.title}>Tinder App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FD2D55', // Tinder red
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
});

export default SplashScreen;
