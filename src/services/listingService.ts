import { Listing, Category } from '../types';
import { MOCK_LISTINGS } from '../data/mockData';
import { http } from './httpClient';
import { USE_MOCK } from './config';

// -----------------------------------------------------------------------------
// LESSON: The Service Pattern
//
// Every function has this shape:
//
//   export async function getSomething(params): Promise<Something> {
//     if (USE_MOCK) return mockVersion(params);   ← instant, no network
//     return http.get('/api/endpoint');            ← real backend
//   }
//
// Your screens and context NEVER import mockData directly.
// They only call service functions. That means:
//   • To switch to a real backend → change USE_MOCK / set API_URL
//   • Screen code stays exactly the same either way
// -----------------------------------------------------------------------------

export interface GetListingsParams {
  category?: Category;
  query?: string;
  maxPrice?: number;
  negotiableOnly?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

// ── MOCK helpers (runs in-process, zero latency) ─────────────────────────────

function filterMock(params: GetListingsParams): Listing[] {
  let results = MOCK_LISTINGS.filter(l => l.isAvailable);
  if (params.category)       results = results.filter(l => l.category === params.category);
  if (params.maxPrice)       results = results.filter(l => l.price <= params.maxPrice!);
  if (params.negotiableOnly) results = results.filter(l => l.negotiable);
  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(l =>
      l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
    );
  }
  switch (params.sortBy) {
    case 'price_asc':  return results.sort((a, b) => a.price - b.price);
    case 'price_desc': return results.sort((a, b) => b.price - a.price);
    case 'popular':    return results.sort((a, b) => b.views - a.views);
    default:           return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Fetch all listings with optional filters */
export async function getListings(params: GetListingsParams = {}): Promise<Listing[]> {
  if (USE_MOCK) return filterMock(params);

  // Build query string from params
  const qs = new URLSearchParams();
  if (params.category)       qs.set('category',       params.category);
  if (params.query)          qs.set('q',              params.query);
  if (params.maxPrice)       qs.set('maxPrice',        String(params.maxPrice));
  if (params.negotiableOnly) qs.set('negotiable',      'true');
  if (params.sortBy)         qs.set('sortBy',          params.sortBy);
  if (params.page)           qs.set('page',            String(params.page));
  if (params.limit)          qs.set('limit',           String(params.limit));

  return http.get<Listing[]>(`/api/listings?${qs.toString()}`);
}

/** Fetch a single listing by ID */
export async function getListingById(id: string): Promise<Listing> {
  if (USE_MOCK) {
    const found = MOCK_LISTINGS.find(l => l.id === id);
    if (!found) throw new Error(`Listing ${id} not found`);
    return found;
  }
  return http.get<Listing>(`/api/listings/${id}`);
}

/** Create a new listing */
export async function createListing(
  data: Omit<Listing, 'id' | 'createdAt' | 'views' | 'isAvailable'>
): Promise<Listing> {
  if (USE_MOCK) {
    // Simulate what the server would return
    return {
      ...data,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      views: 0,
      isAvailable: true,
    };
  }
  return http.post<Listing>('/api/listings', data);
}

/** Update an existing listing */
export async function updateListing(id: string, data: Partial<Listing>): Promise<Listing> {
  if (USE_MOCK) {
    const existing = MOCK_LISTINGS.find(l => l.id === id)!;
    return { ...existing, ...data };
  }
  return http.patch<Listing>(`/api/listings/${id}`, data);
}

/** Delete a listing */
export async function deleteListing(id: string): Promise<void> {
  if (USE_MOCK) return; // nothing to do locally
  return http.delete(`/api/listings/${id}`);
}
