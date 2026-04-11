import { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types';
import { getListings, GetListingsParams } from '../services/listingService';
import { useApp } from '../context/AppContext';

// -----------------------------------------------------------------------------
// LESSON: Data-fetching hook
//
// Screens should NOT call fetch/service functions directly in the component
// body because:
//   • No loading state → blank screen while data loads
//   • No error state → silent failures
//   • Runs on every render → infinite loops with useState
//
// This hook gives any screen three things for free:
//   { listings, loading, error, refresh }
//
// Usage in a screen:
//   const { listings, loading, error, refresh } = useListings({ category: 'textbooks' });
// -----------------------------------------------------------------------------

interface UseListingsResult {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useListings(params: GetListingsParams = {}): UseListingsResult {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // RULE rerender-dependencies:
  // Objects are compared by reference, so { category: 'books' } !== { category: 'books' }
  // on every render. Pull out primitive values so useCallback gets stable deps.
  const { category, query, maxPrice, negotiableOnly, sortBy, page, limit } = params;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getListings({
        category, query, maxPrice, negotiableOnly, sortBy, page, limit,
      });
      // Push fetched listings into the global state so the whole app benefits
      data.forEach(listing => dispatch({ type: 'UPDATE_LISTING', listing }));
    } catch (e: any) {
      setError(e.message ?? 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [category, query, maxPrice, negotiableOnly, sortBy, page, limit, dispatch]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // RULE js-combine-iterations:
  // One pass instead of three chained .filter() calls — avoids creating
  // two intermediate arrays on every render.
  const listings = state.listings.filter(l => {
    if (!l.isAvailable) return false;
    if (category && l.category !== category) return false;
    if (maxPrice && l.price > maxPrice) return false;
    if (negotiableOnly && !l.negotiable) return false;
    if (query) {
      const q = query.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
    }
    return true;
  });

  return { listings, loading, error, refresh: fetchListings };
}
