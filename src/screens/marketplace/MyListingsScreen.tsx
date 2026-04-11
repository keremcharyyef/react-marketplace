import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import ListingCard from '../../components/common/ListingCard';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;

export default function MyListingsScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useApp();
  const myListings = state.listings.filter(l => l.sellerId === state.currentUser.id);

  const handleDelete = (listingId: string, title: string) => {
    Alert.alert('Delete Listing', `Remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch({ type: 'DELETE_LISTING', listingId }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Listings ({myListings.length})</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateListing')}>
          <Ionicons name="add" size={26} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={myListings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ListingCard
              listing={item}
              horizontal
              onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('EditListing', { listingId: item.id })}
              >
                <Ionicons name="pencil-outline" size={14} color="#2196F3" />
                <Text style={[styles.actionText, { color: '#2196F3' }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Ionicons name="trash-outline" size={14} color="#F44336" />
                <Text style={[styles.actionText, { color: '#F44336' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="pricetag-outline" size={56} color="#ddd" />
            <Text style={styles.emptyText}>No listings yet</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateListing')}>
              <Text style={styles.addBtnText}>Post Your First Listing</Text>
            </TouchableOpacity>
          </View>
        }
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
  itemWrapper: { marginBottom: 4 },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 4,
  },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#E3F2FD' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#FFEBEE' },
  actionText: { fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 16, marginBottom: 20 },
  addBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
