import {
  Product,
  Order,
  LedgerEntry,
  Coupon,
  FeatureFlags,
  ProductId,
  VariantId,
} from '../domain/types';

export const STORAGE_KEY = 'vala-commerce:state:v1';

export interface PersistedCartLine {
  productId: ProductId;
  variantId: VariantId;
  quantity: number;
}

/**
 * Transactional state only: anything a visitor can lose by refreshing.
 * The active view is deliberately absent — the URL owns it.
 */
export interface PersistedState {
  version: 1;
  products: Product[];
  cart: PersistedCartLine[];
  activeCoupon: Coupon | null;
  orders: Order[];
  ledgerEntries: LedgerEntry[];
  featureFlags: FeatureFlags;
  wishlistIds: ProductId[];
  comparisonIds: ProductId[];
  selectedAddressId: string;
  selectedShippingMethodId: string;
  customerInfo: { name: string; phone: string; nationalCode: string };
  checkoutStep: number;
  lastCreatedOrder: Order | null;
  selectedProductId: ProductId | null;
  selectedVariantId: VariantId | null;
}

export function loadPersistedState(): PersistedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedState;
    if (
      !parsed ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.products) ||
      !Array.isArray(parsed.orders) ||
      !Array.isArray(parsed.ledgerEntries)
    ) {
      return null;
    }
    return parsed;
  } catch {
    // Corrupted or unavailable storage (private mode, quota) — start fresh.
    return null;
  }
}

export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the app keeps working from memory.
  }
}

export function clearPersistedState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
