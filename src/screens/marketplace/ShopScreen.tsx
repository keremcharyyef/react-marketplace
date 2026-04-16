/**
 * ShopScreen — Beginner-friendly starter page
 *
 * This screen shows a list of ready-made items from mockData.
 * Great place to experiment! Try:
 *   - Changing colors in the `styles` object at the bottom
 *   - Adding a new item to MOCK_LISTINGS in src/data/mockData.ts
 *   - Changing what info shows on each card (price, title, etc.)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MOCK_LISTINGS, CATEGORIES } from '../../data/mockData';
import { Listing, MarketplaceStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;

// ─── Helper: format price ────────────────────────────────────────────────────
function formatPrice(price: number) {
  return `$${price}`;
}

// ─── Category filter pill ─────────────────────────────────────────────────────
function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Single item card ─────────────────────────────────────────────────────────
function ItemCard({ item, onPress }: { item: Listing; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Item image */}
      <Image source={{ uri: item.images[0] }} style={styles.cardImage} />

      {/* Info row */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.cardMeta}>
          <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
          {item.negotiable && (
            <Text style={styles.cardNegotiable}>· Negotiable</Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <Ionicons name="location-outline" size={12} color="#888" />
          <Text style={styles.cardLocation}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ShopScreen() {
  const navigation = useNavigation<Nav>();

  // Which category filter is selected. 'all' means show everything.
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter listings based on the selected category
  const filteredItems =
    selectedCategory === 'all'
      ? MOCK_LISTINGS
      : MOCK_LISTINGS.filter((item) => item.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Page header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop</Text>
        <Text style={styles.headerSub}>{filteredItems.length} items available</Text>
      </View>

      {/* ── Category filter bar ──────────────────────────────── */}
      <FlatList
        horizontal
        data={[{ id: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))]}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
        renderItem={({ item }) => (
          <FilterPill
            label={item.label}
            active={selectedCategory === item.id}
            onPress={() => setSelectedCategory(item.id)}
          />
        )}
      />

      {/* ── Items grid ──────────────────────────────────────── */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}           // 2-column grid — change to 1 for a single column list
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No items in this category yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// Edit these to change how the screen looks!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  headerSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },

  // Filter pills
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: '#4CAF50',   // ← change this color to style active pill
  },
  pillText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
  },

  // List layout
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // Item card
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#EEE',  // placeholder color while image loads
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4CAF50',          // ← price color
  },
  cardNegotiable: {
    fontSize: 11,
    color: '#888',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardLocation: {
    fontSize: 11,
    color: '#888',
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 15,
  },
});
