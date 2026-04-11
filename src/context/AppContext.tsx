import React, {
  createContext, useContext, useReducer, useEffect, ReactNode,
} from 'react';
import { Listing, CartItem, User } from '../types';
import { MOCK_LISTINGS, CURRENT_USER } from '../data/mockData';
import { getListings } from '../services/listingService';

// -----------------------------------------------------------------------------
// LESSON: How the context connects to the backend
//
// AppContext is the single source of truth for in-memory data.
// On mount, AppProvider calls the service layer to hydrate its state.
//
//   Component → useApp() → AppContext (in-memory state)
//                               ↑
//                     useEffect → service → real API  (or mock data)
//
// Every dispatched action (ADD_LISTING, UPDATE_LISTING, etc.) updates the
// in-memory state optimistically, so the UI stays snappy.
// The service layer also sends the change to the real API in the background.
// -----------------------------------------------------------------------------

interface AppState {
  currentUser: User;
  listings: Listing[];
  cart: CartItem[];
  savedListings: string[];
  isAuthenticated: boolean;
  // New: track whether the initial data load has finished
  bootstrapped: boolean;
}

type AppAction =
  | { type: 'TOGGLE_SAVE'; listingId: string }
  | { type: 'ADD_TO_CART'; listing: Listing }
  | { type: 'REMOVE_FROM_CART'; listingId: string }
  | { type: 'UPDATE_CART_QUANTITY'; listingId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_LISTING'; listing: Listing }
  | { type: 'UPDATE_LISTING'; listing: Listing }
  | { type: 'DELETE_LISTING'; listingId: string }
  | { type: 'LOGOUT' }
  | { type: 'LOGIN'; user: User }
  // New: replaces the entire listing array after a backend fetch
  | { type: 'SET_LISTINGS'; listings: Listing[] };

// RULE rerender-lazy-state-init:
// Pass a function to useReducer's initial state so this computation only
// runs once at mount, not on every render.
function buildInitialState(): AppState {
  return {
    currentUser: CURRENT_USER,
    listings: MOCK_LISTINGS,          // pre-populate with mock so UI is instant
    cart: [],
    savedListings: MOCK_LISTINGS.filter(l => l.isSaved).map(l => l.id),
    isAuthenticated: true,
    bootstrapped: false,
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LISTINGS':
      // Replace the full list with what came from the API.
      // Cart and saved lists stay intact — they live separately.
      return { ...state, listings: action.listings, bootstrapped: true };

    case 'TOGGLE_SAVE': {
      const isSaved = state.savedListings.includes(action.listingId);
      return {
        ...state,
        savedListings: isSaved
          ? state.savedListings.filter(id => id !== action.listingId)
          : [...state.savedListings, action.listingId],
      };
    }
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.listing.id === action.listing.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.listing.id === action.listing.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { listing: action.listing, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.listing.id !== action.listingId) };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(i =>
          i.listing.id === action.listingId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_LISTING':
      return { ...state, listings: [action.listing, ...state.listings] };
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: state.listings.map(l => (l.id === action.listing.id ? action.listing : l)),
      };
    case 'DELETE_LISTING':
      return { ...state, listings: state.listings.filter(l => l.id !== action.listingId) };
    case 'LOGIN':
      return { ...state, currentUser: action.user, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, buildInitialState);

  // ── Bootstrap: load real listings on mount ─────────────────────────────────
  // LESSON: This runs once when the app opens.
  // • If USE_MOCK=true  → getListings() returns mock data instantly (no network)
  // • If USE_MOCK=false → getListings() calls the real API
  // Either way, the UI already has mock data from initialState, so the screen
  // is never blank — it just refreshes when the real data arrives.
  useEffect(() => {
    getListings().then(listings => {
      dispatch({ type: 'SET_LISTINGS', listings });
    }).catch(() => {
      // Backend unreachable → keep showing mock data, mark as bootstrapped
      dispatch({ type: 'SET_LISTINGS', listings: MOCK_LISTINGS });
    });
  }, []);

  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.listing.price * item.quantity,
    0
  );
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider value={{ state, dispatch, cartTotal, cartCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
