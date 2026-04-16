export type Category =
  | 'textbooks'
  | 'electronics'
  | 'clothing'
  | 'furniture'
  | 'sports'
  | 'food'
  | 'services'
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  avatar?: string;
  rating: number;
  totalSales: number;
  joinedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  category: Category;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerUniversity: string;
  sellerRating: number;
  location: string;
  createdAt: string;
  isSaved: boolean;
  isAvailable: boolean;
  views: number;
}

export interface CartItem {
  listing: Listing;
  quantity: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  sellerId: string;
  otherPartyName: string;
  otherPartyAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  BrowseTab: undefined;
  ShopTab: undefined;
  SellTab: undefined;
  MessagesTab: undefined;
  ProfileTab: undefined;
};

export type MarketplaceStackParamList = {
  Home: undefined;
  Browse: { category?: Category; searchQuery?: string };
  ListingDetail: { listingId: string };
  SellerProfile: { sellerId: string };
  CreateListing: undefined;
  EditListing: { listingId: string };
  Cart: undefined;
  Checkout: undefined;
  Messages: undefined;
  Chat: { conversationId: string; otherPartyName: string };
  Profile: undefined;
  Settings: undefined;
  SavedListings: undefined;
  MyListings: undefined;
};
