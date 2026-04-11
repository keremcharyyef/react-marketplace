import { Listing, Category } from '../types';

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function formatCondition(condition: Listing['condition']): string {
  const map: Record<Listing['condition'], string> = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };
  return map[condition];
}

export function getConditionColor(condition: Listing['condition']): string {
  const map: Record<Listing['condition'], string> = {
    new: '#4CAF50',
    like_new: '#8BC34A',
    good: '#FF9800',
    fair: '#FF5722',
    poor: '#F44336',
  };
  return map[condition];
}

export function filterListings(
  listings: Listing[],
  query: string,
  category?: Category,
  maxPrice?: number
): Listing[] {
  return listings.filter(l => {
    if (!l.isAvailable) return false;
    if (category && l.category !== category) return false;
    if (maxPrice && l.price > maxPrice) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
