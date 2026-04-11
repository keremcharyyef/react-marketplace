import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  MarketplaceStackParamList,
} from '../types';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Marketplace Screens
import HomeScreen from '../screens/marketplace/HomeScreen';
import BrowseScreen from '../screens/marketplace/BrowseScreen';
import ListingDetailScreen from '../screens/marketplace/ListingDetailScreen';
import CreateListingScreen from '../screens/marketplace/CreateListingScreen';
import CartScreen from '../screens/marketplace/CartScreen';
import MessagesScreen from '../screens/marketplace/MessagesScreen';
import ChatScreen from '../screens/marketplace/ChatScreen';
import ProfileScreen from '../screens/marketplace/ProfileScreen';
import SavedListingsScreen from '../screens/marketplace/SavedListingsScreen';
import MyListingsScreen from '../screens/marketplace/MyListingsScreen';
import SellerProfileScreen from '../screens/marketplace/SellerProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

type AnyMarketplaceStack = ReturnType<typeof createNativeStackNavigator<MarketplaceStackParamList>>;

// Shared stack screens available from any tab
function sharedScreens(Stack: AnyMarketplaceStack) {
  return (
    <>
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
      <Stack.Screen name="CreateListing" component={CreateListingScreen} />
      <Stack.Screen name="EditListing" component={CreateListingScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CartScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="SavedListings" component={SavedListingsScreen} />
      <Stack.Screen name="MyListings" component={MyListingsScreen} />
    </>
  );
}

// Each tab gets its own stack so every tab can push ListingDetail, Cart, etc.
const HomeStack = createNativeStackNavigator<MarketplaceStackParamList>();
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Browse" component={BrowseScreen} />
      <HomeStack.Screen name="Messages" component={MessagesScreen} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="Settings" component={ProfileScreen} />
      {sharedScreens(HomeStack)}
    </HomeStack.Navigator>
  );
}

const BrowseStack = createNativeStackNavigator<MarketplaceStackParamList>();
function BrowseNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
      <BrowseStack.Screen name="Browse" component={BrowseScreen} />
      <BrowseStack.Screen name="Home" component={HomeScreen} />
      <BrowseStack.Screen name="Messages" component={MessagesScreen} />
      <BrowseStack.Screen name="Profile" component={ProfileScreen} />
      <BrowseStack.Screen name="Settings" component={ProfileScreen} />
      {sharedScreens(BrowseStack)}
    </BrowseStack.Navigator>
  );
}

const MessagesStack = createNativeStackNavigator<MarketplaceStackParamList>();
function MessagesNavigator() {
  return (
    <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
      <MessagesStack.Screen name="Messages" component={MessagesScreen} />
      <MessagesStack.Screen name="Chat" component={ChatScreen} />
      <MessagesStack.Screen name="Home" component={HomeScreen} />
      <MessagesStack.Screen name="Browse" component={BrowseScreen} />
      <MessagesStack.Screen name="Profile" component={ProfileScreen} />
      <MessagesStack.Screen name="Settings" component={ProfileScreen} />
      {sharedScreens(MessagesStack)}
    </MessagesStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator<MarketplaceStackParamList>();
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Home" component={HomeScreen} />
      <ProfileStack.Screen name="Browse" component={BrowseScreen} />
      <ProfileStack.Screen name="Messages" component={MessagesScreen} />
      <ProfileStack.Screen name="Settings" component={ProfileScreen} />
      {sharedScreens(ProfileStack)}
    </ProfileStack.Navigator>
  );
}

function TabBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

function MainNavigator() {
  const { cartCount } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          height: 80,
          paddingBottom: 16,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BrowseTab"
        component={BrowseNavigator}
        options={{
          tabBarLabel: 'Browse',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SellTab"
        component={CreateListingScreen}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.sellTabIcon}>
              <Ionicons name="add" size={28} color="#fff" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesNavigator}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={size} color={color} />
              <TabBadge count={1} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { state } = useApp();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {state.isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sellTabIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E91E63',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
