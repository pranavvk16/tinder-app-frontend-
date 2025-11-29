import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AccountScreen = () => {
  // Placeholder data for a static account section
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const user = {
    name: "Ethan Wells",
    age: 30,
    location: "Seattle, WA",
    bio: "Product designer. Weekend hiker. Into coffee rituals and live music.",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    passions: ["Design", "Outdoors", "Coffee", "Live Music", "Travel"],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { height: Math.min(Math.max(screenHeight * 0.35, 220), 340) }]}>
          <Image source={{ uri: user.profilePicture }} style={styles.heroImage} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}, {user.age}</Text>
              <View style={styles.verified}>
                <Ionicons name="checkmark-circle" size={18} color="#2dd36f" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={18} color="#fff" />
              <Text style={styles.location}>{user.location}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { width: Math.min(screenWidth * 0.92, 520) }]}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>

        <View style={[styles.card, { width: Math.min(screenWidth * 0.92, 520) }]}>
          <Text style={styles.sectionTitle}>Passions</Text>
          <View style={styles.chipRow}>
            {user.passions.map((tag) => (
              <View key={tag} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.actionRow, { width: Math.min(screenWidth * 0.92, 520) }]}>
          <TouchableOpacity style={[styles.actionBtn, styles.editBtn]}>
            <Ionicons name="create-outline" size={18} color="#fd2d55" />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.settingsBtn]}>
            <Ionicons name="settings-outline" size={18} color="#555" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  hero: {
    width: '100%',
    height: 260,
    backgroundColor: '#ddd',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 211, 111, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  verifiedText: {
    color: '#e6fff0',
    marginLeft: 6,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  location: {
    fontSize: 16,
    color: '#f0f0f0',
  },
  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  bioText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff4f7',
    borderColor: '#fd2d55',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    color: '#fd2d55',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    columnGap: 8,
  },
  editBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fdc9d4',
    marginRight: 8,
  },
  settingsBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 8,
  },
  actionText: {
    fontWeight: '700',
    color: '#333',
  },
});

export default AccountScreen;
