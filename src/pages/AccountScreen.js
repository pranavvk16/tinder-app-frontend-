import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AccountScreen = () => {
  // Placeholder data for a static account section
  const user = {
    name: "John Doe",
    age: 28,
    location: "New York",
    bio: "Passionate about technology and travel.",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjU2MTd8MHwxfGFsbHwxfHx8fHx8fHwxNjQyNzA4NDEz&ixlib=rb-1.2.1&q=80&w=1080", // Placeholder image
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
        <Text style={styles.name}>{user.name}, {user.age}</Text>
        <Text style={styles.location}>{user.location}</Text>
      </View>
      <View style={styles.profileDetails}>
        <Text style={styles.bioTitle}>About Me</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>
      {/* Add more static details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 50,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FD2D55',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  profileDetails: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  bioText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default AccountScreen;
