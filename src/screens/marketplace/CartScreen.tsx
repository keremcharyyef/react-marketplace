import React from 'react';
import {
  View,
  Text,
  FlatList,
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
import { formatPrice } from '../../utils/helpers';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;

export default function CartScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch, cartTotal } = useApp();

  const handleCheckout = () => {
    Alert.alert(
      'Order Confirmed!',
      `Your order of ${formatPrice(cartTotal)} has been placed. Contact sellers to arrange meetup.`,
      [{ text: 'Great!', onPress: () => { dispatch({ type: 'CLEAR_CART' }); navigation.goBack(); } }]
    );
  };

  if (state.cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={64} color="#ddd" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Browse listings and add items to your cart</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Browse', {})}>
            <Text style={styles.browseBtnText}>Browse Listings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({state.cart.length})</Text>
        <TouchableOpacity onPress={() => dispatch({ type: 'CLEAR_CART' })}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.cart}
        keyExtractor={item => item.listing.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <TouchableOpacity onPress={() => navigation.navigate('ListingDetail', { listingId: item.listing.id })}>
              <Image source={{ uri: item.listing.images[0] }} style={styles.itemImage} />
            </TouchableOpacity>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.listing.title}</Text>
              <Text style={styles.itemSeller}>{item.listing.sellerName}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.listing.price)}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => dispatch({ type: 'REMOVE_FROM_CART', listingId: item.listing.id })}
              >
                <Ionicons name="trash-outline" size={18} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Order Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items ({state.cart.length})</Text>
          <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Platform Fee</Text>
          <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>Free</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Confirm Order</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.checkoutNote}>
          Payment is handled directly between students — cash, Venmo, or your preferred method.
        </Text>
      </View>
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
  clearText: { fontSize: 14, color: '#F44336', fontWeight: '600' },
  list: { padding: 16 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, resizeMode: 'cover' },
  itemInfo: { flex: 1, marginHorizontal: 12 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  itemSeller: { fontSize: 12, color: '#888', marginBottom: 6 },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#4CAF50' },
  itemActions: { justifyContent: 'center' },
  removeBtn: { padding: 8 },
  separator: { height: 10 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#999', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#bbb', marginTop: 8, textAlign: 'center' },
  browseBtn: {
    marginTop: 24,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  summary: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
    paddingBottom: 28,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12, marginTop: 4, marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#4CAF50' },
  checkoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkoutBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  checkoutNote: { fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 16 },
});
