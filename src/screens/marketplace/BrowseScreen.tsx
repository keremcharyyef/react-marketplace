import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList, Category } from '../../types';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { filterListings } from '../../utils/helpers';
import ListingCard from '../../components/common/ListingCard';
import SearchBar from '../../components/common/SearchBar';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;
type Route = RouteProp<MarketplaceStackParamList, 'Browse'>;

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

export default function BrowseScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state } = useApp();

  const [query, setQuery] = useState(route.params?.searchQuery ?? '');
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(route.params?.category);
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [negotiableOnly, setNegotiableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let results = filterListings(state.listings, query, selectedCategory, maxPrice);
    if (negotiableOnly) results = results.filter(l => l.negotiable);

    switch (sortBy) {
      case 'price_asc': return [...results].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...results].sort((a, b) => b.price - a.price);
      case 'popular': return [...results].sort((a, b) => b.views - a.views);
      default: return [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [state.listings, query, selectedCategory, maxPrice, negotiableOnly, sortBy]);

  const activeFilterCount = [selectedCategory, maxPrice, negotiableOnly ? 1 : undefined].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onFilterPress={() => setShowFilters(true)}
        />
      </View>

      {/* Category Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        <TouchableOpacity
          style={[styles.chip, !selectedCategory && styles.chipActive]}
          onPress={() => setSelectedCategory(undefined)}
        >
          <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selectedCategory === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}
            onPress={() => setSelectedCategory(selectedCategory === cat.id ? undefined : cat.id)}
          >
            <Ionicons name={cat.icon as any} size={13} color={selectedCategory === cat.id ? '#fff' : cat.color} />
            <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results bar */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          <Text style={styles.resultCount}>{filtered.length}</Text> listings
          {activeFilterCount > 0 && (
            <Text style={styles.filterActive}> · {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</Text>
          )}
        </Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity onPress={() => setViewMode('grid')} style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}>
            <Ionicons name="grid" size={16} color={viewMode === 'grid' ? '#4CAF50' : '#aaa'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}>
            <Ionicons name="list" size={16} color={viewMode === 'list' ? '#4CAF50' : '#aaa'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Listings */}
      {viewMode === 'grid' ? (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color="#ddd" />
              <Text style={styles.emptyText}>No listings found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              horizontal
              onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color="#ddd" />
              <Text style={styles.emptyText}>No listings found</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.filterLabel}>Sort By</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={styles.sortOption}
                onPress={() => setSortBy(opt.id)}
              >
                <Text style={styles.sortLabel}>{opt.label}</Text>
                {sortBy === opt.id && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
              </TouchableOpacity>
            ))}

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Negotiable Only</Text>
              <Switch
                value={negotiableOnly}
                onValueChange={setNegotiableOnly}
                trackColor={{ true: '#4CAF50' }}
              />
            </View>

            <Text style={styles.filterLabel}>Max Price</Text>
            {[25, 50, 100, 250, 500].map(price => (
              <TouchableOpacity
                key={price}
                style={styles.sortOption}
                onPress={() => setMaxPrice(maxPrice === price ? undefined : price)}
              >
                <Text style={styles.sortLabel}>Under ${price}</Text>
                {maxPrice === price && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => { setSelectedCategory(undefined); setMaxPrice(undefined); setNegotiableOnly(false); setSortBy('newest'); }}
            >
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyBtnText}>Show {filtered.length} Results</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  categoryRow: { flexGrow: 0 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    marginRight: 8,
    gap: 5,
  },
  chipActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#fff' },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: { fontSize: 14, color: '#888' },
  resultCount: { fontWeight: '700', color: '#1a1a1a' },
  filterActive: { color: '#4CAF50', fontWeight: '600' },
  viewToggle: { flexDirection: 'row', gap: 4 },
  viewBtn: { padding: 6, borderRadius: 6 },
  viewBtnActive: { backgroundColor: '#E8F5E9' },
  gridContent: { paddingHorizontal: 16, paddingBottom: 24 },
  columnWrapper: { justifyContent: 'space-between' },
  listContent: { padding: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 12 },
  emptySubtext: { fontSize: 14, color: '#bbb', marginTop: 4 },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  modalContent: { flex: 1, padding: 16 },
  filterLabel: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginTop: 16, marginBottom: 8 },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  sortLabel: { fontSize: 15, color: '#333' },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  clearBtnText: { fontSize: 15, fontWeight: '600', color: '#555' },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  applyBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
