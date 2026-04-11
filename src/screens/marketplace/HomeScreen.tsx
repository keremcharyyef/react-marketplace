import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import ListingCard from '../../components/common/ListingCard';
import SearchBar from '../../components/common/SearchBar';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = width * 0.45;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { state, cartCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const recentListings = state.listings.filter(l => l.isAvailable).slice(0, 6);
  const featuredListings = state.listings.filter(l => l.isAvailable && l.views > 100);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Browse', { searchQuery: searchQuery.trim() });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {state.currentUser.name.split(' ')[0]} 👋</Text>
            <Text style={styles.subtitle}>Find great deals on campus</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('SavedListings')}
            >
              <Ionicons name="heart-outline" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="bag-outline" size={24} color="#1a1a1a" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => navigation.navigate('Browse', {})}
          />
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Student Marketplace</Text>
            <Text style={styles.bannerSub}>Buy & sell with fellow students</Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => navigation.navigate('CreateListing')}
            >
              <Text style={styles.bannerBtnText}>Sell Something</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Ionicons name="storefront" size={80} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Listings', value: state.listings.length, icon: 'pricetag' },
            { label: 'Students', value: '2.4K', icon: 'people' },
            { label: 'Saved', value: state.savedListings.length, icon: 'heart' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Browse', {})}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('Browse', { category: cat.id })}
                activeOpacity={0.75}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Browse', {})}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {featuredListings.map(listing => (
              <View key={listing.id} style={styles.featuredCardWrapper}>
                <ListingCard
                  listing={listing}
                  onPress={() => navigation.navigate('ListingDetail', { listingId: listing.id })}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Posted</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Browse', {})}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {recentListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onPress={() => navigation.navigate('ListingDetail', { listingId: listing.id })}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
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
    paddingBottom: 12,
  },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { position: 'relative', padding: 8 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E91E63',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  searchContainer: { paddingHorizontal: 16, marginBottom: 16 },
  heroBanner: {
    marginHorizontal: 16,
    height: BANNER_HEIGHT,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  bannerBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  bannerIcon: { position: 'absolute', right: -10, bottom: -10 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  section: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  seeAll: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
  categoriesScroll: { paddingLeft: 16 },
  categoryItem: { alignItems: 'center', marginRight: 16, marginBottom: 8 },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabel: { fontSize: 12, color: '#555', fontWeight: '500' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  featuredCardWrapper: { width: 160, marginRight: 8 },
});
