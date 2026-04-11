import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList, Category, Listing } from '../../types';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { generateId } from '../../utils/helpers';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;

const CONDITIONS: { id: Listing['condition']; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'like_new', label: 'Like New' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
  { id: 'poor', label: 'Poor' },
];

const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/seed/listing_new_1/400/400',
  'https://picsum.photos/seed/listing_new_2/400/400',
];

export default function CreateListingScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [category, setCategory] = useState<Category>('other');
  const [condition, setCondition] = useState<Listing['condition']>('good');
  const [location, setLocation] = useState('');

  const isValid = title.trim() && description.trim() && price.trim() && parseFloat(price) > 0 && location.trim();

  const handleSubmit = () => {
    if (!isValid) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    const newListing: Listing = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      negotiable,
      category,
      condition,
      images: PLACEHOLDER_IMAGES,
      sellerId: state.currentUser.id,
      sellerName: state.currentUser.name,
      sellerUniversity: state.currentUser.university,
      sellerRating: state.currentUser.rating,
      location: location.trim(),
      createdAt: new Date().toISOString(),
      isSaved: false,
      isAvailable: true,
      views: 0,
    };
    dispatch({ type: 'ADD_LISTING', listing: newListing });
    Alert.alert('Listed!', 'Your item is now live on StudentMarket.', [
      { text: 'View Listing', onPress: () => navigation.replace('ListingDetail', { listingId: newListing.id }) },
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Listing</Text>
          <TouchableOpacity
            style={[styles.postBtn, !isValid && styles.postBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Photo Upload Placeholder */}
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.addPhotoBtn}>
              <Ionicons name="camera-outline" size={32} color="#4CAF50" />
              <Text style={styles.addPhotoText}>Add Photos</Text>
              <Text style={styles.addPhotoSub}>Up to 5 photos</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="What are you selling?"
              placeholderTextColor="#bbb"
              maxLength={80}
            />
            <Text style={styles.charCount}>{title.length}/80</Text>
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, category === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Ionicons name={cat.icon as any} size={14} color={category === cat.id ? '#fff' : cat.color} />
                  <Text style={[styles.categoryChipText, category === cat.id && { color: '#fff' }]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Condition */}
          <View style={styles.field}>
            <Text style={styles.label}>Condition <Text style={styles.required}>*</Text></Text>
            <View style={styles.conditionRow}>
              {CONDITIONS.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.conditionChip, condition === c.id && styles.conditionChipActive]}
                  onPress={() => setCondition(c.id)}
                >
                  <Text style={[styles.conditionChipText, condition === c.id && styles.conditionChipTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price */}
          <View style={styles.field}>
            <Text style={styles.label}>Price <Text style={styles.required}>*</Text></Text>
            <View style={styles.priceInput}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.priceField}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.negotiableRow}>
              <Text style={styles.negotiableLabel}>Open to offers / negotiable</Text>
              <Switch value={negotiable} onValueChange={setNegotiable} trackColor={{ true: '#4CAF50' }} />
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your item — condition details, reason for selling, etc."
              placeholderTextColor="#bbb"
              multiline
              numberOfLines={5}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>Meetup Location <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. North Campus Library, West Dorm..."
              placeholderTextColor="#bbb"
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  postBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  postBtnDisabled: { backgroundColor: '#ccc' },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  scroll: { flex: 1 },
  photoSection: { padding: 16 },
  addPhotoBtn: {
    height: 130,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: { fontSize: 15, fontWeight: '700', color: '#4CAF50', marginTop: 8 },
  addPhotoSub: { fontSize: 12, color: '#aaa', marginTop: 4 },
  field: { paddingHorizontal: 16, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  required: { color: '#E91E63' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
  },
  textarea: { height: 120, paddingTop: 12 },
  charCount: { fontSize: 11, color: '#bbb', textAlign: 'right', marginTop: 4 },
  priceInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 14 },
  dollarSign: { fontSize: 18, fontWeight: '700', color: '#4CAF50', marginRight: 4 },
  priceField: { flex: 1, fontSize: 18, paddingVertical: 12, color: '#1a1a1a' },
  negotiableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  negotiableLabel: { fontSize: 14, color: '#555' },
  categoryRow: { marginTop: 4 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  conditionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  conditionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  conditionChipActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  conditionChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  conditionChipTextActive: { color: '#fff' },
});
