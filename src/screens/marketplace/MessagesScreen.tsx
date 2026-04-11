import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../types';
import { MOCK_CONVERSATIONS } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/helpers';

type Nav = NativeStackNavigationProp<MarketplaceStackParamList>;

export default function MessagesScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.composeBtn}>
          <Ionicons name="create-outline" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.convoItem}
            onPress={() => navigation.navigate('Chat', { conversationId: item.id, otherPartyName: item.otherPartyName })}
            activeOpacity={0.75}
          >
            <View style={styles.avatarContainer}>
              {item.otherPartyAvatar ? (
                <Image source={{ uri: item.otherPartyAvatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarInitial}>{item.otherPartyName[0]}</Text>
                </View>
              )}
              {item.unreadCount > 0 && (
                <View style={styles.unreadDot} />
              )}
            </View>
            <View style={styles.convoInfo}>
              <View style={styles.convoTopRow}>
                <Text style={[styles.convoName, item.unreadCount > 0 && styles.convoNameBold]}>
                  {item.otherPartyName}
                </Text>
                <Text style={styles.convoTime}>{formatRelativeTime(item.lastMessageTime)}</Text>
              </View>
              <Text style={styles.convoListing} numberOfLines={1}>
                Re: {item.listingTitle}
              </Text>
              <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageBold]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={56} color="#ddd" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Contact sellers on listings to start a conversation</Text>
          </View>
        }
      />
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
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  composeBtn: { padding: 4 },
  list: { paddingVertical: 8 },
  convoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatarContainer: { position: 'relative', marginRight: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, resizeMode: 'cover' },
  avatarFallback: { backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: '#fff', fontSize: 20, fontWeight: '700' },
  unreadDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  convoInfo: { flex: 1 },
  convoTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  convoName: { fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
  convoNameBold: { fontWeight: '700' },
  convoTime: { fontSize: 12, color: '#aaa' },
  convoListing: { fontSize: 12, color: '#4CAF50', marginBottom: 3 },
  lastMessage: { fontSize: 13, color: '#999' },
  lastMessageBold: { color: '#444', fontWeight: '600' },
  unreadBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: { color: '#fff', fontSize: 11, fontWeight: '700' },
  separator: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 82 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#bbb', marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
});
