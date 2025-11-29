import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

import SplashScreen from './src/pages/SplashScreen';
import MainScreen from './src/pages/MainScreen';
import LikedPeopleScreen from './src/pages/LikedPeopleScreen';
import AccountScreen from './src/pages/AccountScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MainTab') {
            iconName = focused ? 'flame' : 'flame-outline'; // Tinder icon
          } else if (route.name === 'LikedTab') {
            iconName = focused ? 'albums' : 'albums-outline'; // Grid icon for liked people
          } else if (route.name === 'AccountTab') {
            iconName = focused ? 'person' : 'person-outline'; // Person icon for account
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FD2D55', // Tinder red
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide header for tab screens
      })}
    >
      <Tab.Screen name="MainTab" component={MainScreen} options={{ title: 'Tinder', headerShown: false }} />
      <Tab.Screen name="LikedTab" component={LikedPeopleScreen} options={{ title: 'Liked' }} />
      <Tab.Screen name="AccountTab" component={AccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={MainTabNavigator} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
