import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockData';
import ListingCard from '../../components/common/ListingCard';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;
type Route = RouteProp<MarketplaceStackParamList, 'SellerProfile'>;

export default function SellerProfileScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state } = useApp();

  const seller = MOCK_USERS.find(u => u.id === route.params.sellerId);
  const listings = state.listings.filter(l => l.sellerId === route.params.sellerId && l.isAvailable);

  if (!seller) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seller Profile</Text>
        <View style={{ width: 38 }} />
      </View>

      <FlatList
        data={listings}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <View style={styles.profileCard}>
            {seller.avatar ? (
              <Image source={{ uri: seller.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>{seller.name[0]}</Text>
              </View>
            )}
            <Text style={styles.sellerName}>{seller.name}</Text>
            <View style={styles.universityRow}>
              <Ionicons name="school-outline" size={14} color="#4CAF50" />
              <Text style={styles.universityText}>{seller.university}</Text>
            </View>
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(i => (
                <Ionicons key={i} name={i <= Math.round(seller.rating) ? 'star' : 'star-outline'} size={16} color="#FFB300" />
              ))}
              <Text style={styles.ratingText}>{seller.rating.toFixed(1)} · {seller.totalSales} sales</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{listings.length}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{seller.totalSales}</Text>
                <Text style={styles.statLabel}>Sold</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{seller.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.messageBtn} onPress={() => navigation.navigate('Messages')}>
              <Ionicons name="chatbubble-outline" size={16} color="#4CAF50" />
              <Text style={styles.messageBtnText}>Message Seller</Text>
            </TouchableOpacity>
            <Text style={styles.listingsTitle}>{listings.length} Active Listings</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
          />
        )}
      />
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
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  content: { padding: 16, paddingBottom: 24 },
  columnWrapper: { justifyContent: 'space-between' },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  avatarFallback: { backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: '#fff', fontSize: 32, fontWeight: '700' },
  sellerName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  universityRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  universityText: { fontSize: 14, color: '#4CAF50', fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 16 },
  ratingText: { fontSize: 14, color: '#888', marginLeft: 6 },
  statsRow: { flexDirection: 'row', width: '100%', marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: '#F0F0F0' },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 20,
  },
  messageBtnText: { fontSize: 14, fontWeight: '700', color: '#4CAF50' },
  listingsTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', alignSelf: 'flex-start' },
});
