import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPrice, formatRelativeTime, formatCondition, getConditionColor } from '../../utils/helpers';
import { CATEGORIES } from '../../data/mockData';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;
type Route = RouteProp<MarketplaceStackParamList, 'ListingDetail'>;

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state, dispatch } = useApp();
  const [activeImage, setActiveImage] = useState(0);

  const listing = state.listings.find(l => l.id === route.params.listingId);
  if (!listing) return null;

  const isSaved = state.savedListings.includes(listing.id);
  const inCart = state.cart.some(i => i.listing.id === listing.id);
  const isOwnListing = listing.sellerId === state.currentUser.id;
  const category = CATEGORIES.find(c => c.id === listing.category);

  const handleSave = () => dispatch({ type: 'TOGGLE_SAVE', listingId: listing.id });
  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', listing });
    Alert.alert('Added to Cart', `${listing.title} added to your cart.`, [
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      { text: 'Continue', style: 'cancel' },
    ]);
  };
  const handleContact = () => navigation.navigate('Messages');
  const handleShare = async () => {
    await Share.share({ message: `Check out "${listing.title}" for ${formatPrice(listing.price)} on StudentMarket!` });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Nav Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.navBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleSave}>
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? '#E91E63' : '#1a1a1a'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {listing.images.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={[styles.image, { width }]} />
            ))}
          </ScrollView>
          {listing.images.length > 1 && (
            <View style={styles.dots}>
              {listing.images.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Category + Condition */}
          <View style={styles.tagsRow}>
            {category && (
              <View style={[styles.tag, { backgroundColor: category.color + '20' }]}>
                <Ionicons name={category.icon as any} size={13} color={category.color} />
                <Text style={[styles.tagText, { color: category.color }]}>{category.label}</Text>
              </View>
            )}
            <View style={[styles.tag, { backgroundColor: getConditionColor(listing.condition) + '20' }]}>
              <Text style={[styles.tagText, { color: getConditionColor(listing.condition) }]}>
                {formatCondition(listing.condition)}
              </Text>
            </View>
            {listing.negotiable && (
              <View style={[styles.tag, { backgroundColor: '#FF990020' }]}>
                <Text style={[styles.tagText, { color: '#FF9900' }]}>Negotiable</Text>
              </View>
            )}
          </View>

          {/* Title + Price */}
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(listing.price)}</Text>
            <View style={styles.viewsRow}>
              <Ionicons name="eye-outline" size={15} color="#aaa" />
              <Text style={styles.views}>{listing.views} views</Text>
            </View>
          </View>

          {/* Location + Time */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color="#888" />
              <Text style={styles.infoText}>{listing.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color="#888" />
              <Text style={styles.infoText}>{formatRelativeTime(listing.createdAt)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          {/* Seller */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <TouchableOpacity
              style={styles.sellerCard}
              onPress={() => navigation.navigate('SellerProfile', { sellerId: listing.sellerId })}
              activeOpacity={0.8}
            >
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerInitial}>{listing.sellerName[0]}</Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{listing.sellerName}</Text>
                <Text style={styles.sellerUniversity}>{listing.sellerUniversity}</Text>
                <View style={styles.ratingRow}>
                  {[1,2,3,4,5].map(i => (
                    <Ionicons
                      key={i}
                      name={i <= Math.round(listing.sellerRating) ? 'star' : 'star-outline'}
                      size={13}
                      color="#FFB300"
                    />
                  ))}
                  <Text style={styles.ratingText}>{listing.sellerRating.toFixed(1)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      {!isOwnListing && (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.messageBtn} onPress={handleContact}>
            <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cartBtn, inCart && styles.cartBtnActive]}
            onPress={handleAddToCart}
          >
            <Ionicons name={inCart ? 'bag-check' : 'bag-add-outline'} size={20} color="#fff" />
            <Text style={styles.cartBtnText}>{inCart ? 'In Cart' : 'Add to Cart'}</Text>
          </TouchableOpacity>
        </View>
      )}
      {isOwnListing && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditListing', { listingId: listing.id })}
          >
            <Ionicons name="pencil-outline" size={20} color="#fff" />
            <Text style={styles.cartBtnText}>Edit Listing</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navBtn: { padding: 8 },
  navActions: { flexDirection: 'row' },
  image: { height: width * 0.85, resizeMode: 'cover' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd' },
  dotActive: { backgroundColor: '#4CAF50', width: 18 },
  content: { padding: 16 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 10, lineHeight: 28 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 28, fontWeight: '800', color: '#4CAF50' },
  viewsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  views: { fontSize: 13, color: '#aaa' },
  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { fontSize: 14, color: '#666' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },
  description: { fontSize: 15, color: '#444', lineHeight: 24 },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 14,
  },
  sellerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerInitial: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  sellerUniversity: { fontSize: 13, color: '#888', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 2 },
  ratingText: { fontSize: 13, color: '#888', marginLeft: 4 },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  messageBtnText: { fontSize: 15, fontWeight: '700', color: '#4CAF50' },
  cartBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  cartBtnActive: { backgroundColor: '#388E3C' },
  cartBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2196F3',
  },
});
