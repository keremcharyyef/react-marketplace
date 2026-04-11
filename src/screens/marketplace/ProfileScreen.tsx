import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;

const MENU_ITEMS = [
  { icon: 'pricetag-outline', label: 'My Listings', screen: 'MyListings' as const, badge: null },
  { icon: 'heart-outline', label: 'Saved Items', screen: 'SavedListings' as const, badge: null },
  { icon: 'bag-outline', label: 'Cart', screen: 'Cart' as const, badge: null },
  { icon: 'chatbubble-outline', label: 'Messages', screen: 'Messages' as const, badge: '2' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useApp();
  const user = state.currentUser;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => dispatch({ type: 'LOGOUT' }) },
    ]);
  };

  const myListings = state.listings.filter(l => l.sellerId === user.id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>{user.name[0]}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.universityRow}>
            <Ionicons name="school-outline" size={14} color="#4CAF50" />
            <Text style={styles.universityText}>{user.university}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{myListings.length}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.totalSales}</Text>
              <Text style={styles.statLabel}>Sales</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFB300" />
                <Text style={styles.statValue}>{user.rating}</Text>
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.sellBtn} onPress={() => navigation.navigate('CreateListing')}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.sellBtnText}>Post Listing</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name={item.icon as any} size={20} color="#4CAF50" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Member Since */}
        <View style={styles.memberInfo}>
          <Ionicons name="calendar-outline" size={14} color="#aaa" />
          <Text style={styles.memberText}>Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#F44336" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  settingsBtn: { padding: 4 },
  userCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarFallback: { backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: '#fff', fontSize: 32, fontWeight: '700' },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#888', marginBottom: 8 },
  universityRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 16 },
  universityText: { fontSize: 14, color: '#4CAF50', fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#F0F0F0' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  quickActions: { paddingHorizontal: 16, marginBottom: 16 },
  sellBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
  },
  sellBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  menu: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  menuBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  memberText: { fontSize: 13, color: '#aaa' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF5F5',
  },
  logoutText: { fontSize: 15, color: '#F44336', fontWeight: '600' },
});
