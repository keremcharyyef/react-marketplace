import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Listing } from '../../types';
import { formatPrice, formatRelativeTime, formatCondition, getConditionColor } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

interface Props {
  listing: Listing;
  onPress: () => void;
  horizontal?: boolean;
}

export default function ListingCard({ listing, onPress, horizontal = false }: Props) {
  const { state, dispatch } = useApp();
  const isSaved = state.savedListings.includes(listing.id);

  const handleSave = (e: any) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_SAVE', listingId: listing.id });
  };

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: listing.images[0] }} style={styles.horizontalImage} />
        <View style={styles.horizontalInfo}>
          <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
          <Text style={styles.price}>{formatPrice(listing.price)}</Text>
          {listing.negotiable && <Text style={styles.negotiable}>Negotiable</Text>}
          <View style={styles.meta}>
            <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(listing.condition) + '22' }]}>
              <Text style={[styles.conditionText, { color: getConditionColor(listing.condition) }]}>
                {formatCondition(listing.condition)}
              </Text>
            </View>
            <Text style={styles.time}>{formatRelativeTime(listing.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={20} color={isSaved ? '#E91E63' : '#999'} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, { width: CARD_WIDTH }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.images[0] }} style={styles.image} />
        <TouchableOpacity style={styles.heartBtn} onPress={handleSave}>
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={18} color={isSaved ? '#E91E63' : '#fff'} />
        </TouchableOpacity>
        {listing.negotiable && (
          <View style={styles.negBadge}>
            <Text style={styles.negText}>OBO</Text>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <View style={styles.cardFooter}>
          <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(listing.condition) + '22' }]}>
            <Text style={[styles.conditionText, { color: getConditionColor(listing.condition) }]}>
              {formatCondition(listing.condition)}
            </Text>
          </View>
          <Text style={styles.time}>{formatRelativeTime(listing.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: CARD_WIDTH * 0.85, resizeMode: 'cover' },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 5,
  },
  negBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FF9800',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  negText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardInfo: { padding: 10 },
  title: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 4, lineHeight: 18 },
  price: { fontSize: 16, fontWeight: '700', color: '#4CAF50', marginBottom: 6 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  conditionBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  conditionText: { fontSize: 10, fontWeight: '600' },
  time: { fontSize: 11, color: '#999' },
  negotiable: { fontSize: 11, color: '#FF9800', fontWeight: '600', marginBottom: 4 },

  // Horizontal card
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  horizontalImage: { width: 100, height: 100, resizeMode: 'cover' },
  horizontalInfo: { flex: 1, padding: 12 },
  saveBtn: { padding: 12, justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
});
