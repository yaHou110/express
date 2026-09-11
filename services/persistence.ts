import {
  Product,
  Order,
  LedgerEntry,
  Coupon,
  FeatureFlags,
  ProductId,
  VariantId,
} from '../domain/types';
import { VALID_COUPONS } from '../data/catalogData';
import { DEFAULT_FEATURE_FLAGS } from '../domain/features';

export const STORAGE_KEY = 'vala-commerce:state:v1';

/**
 * Anything larger than this is not a state this app wrote; refuse it before parsing so
 * a corrupted or hostile payload cannot stall the main thread on load.
 */
export const MAX_PAYLOAD_BYTES = 1_000_000;

const STORAGE_VERSION = 1;
const FIRST_CHECKOUT_STEP = 1;
const LAST_CHECKOUT_STEP = 4;

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

/**
 * What a restore is allowed to return: only the slices that survived validation. An absent
 * key means "keep the default", which is different from a slice that is valid but empty.
 */
export type RestorableState = Partial<Omit<PersistedState, 'version'>>;

// --- guards -------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isMoney(value: unknown): boolean {
  if (!isRecord(value) || !Number.isFinite(value.amount)) return false;
  return value.currency === 'TOMAN' || value.currency === 'IRR';
}

// --- slice sanitizers ---------------------------------------------------------------
// Each returns the sanitized value, or undefined to mean "this slice is unusable, keep
// the default". Nothing that reaches the store is left unchecked.

function sanitizeProducts(value: unknown): Product[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;

  const usable = value.every((product) => {
    if (!isRecord(product) || !isNonEmptyString(product.id)) return false;
    if (!Array.isArray(product.variants) || product.variants.length === 0) return false;

    return product.variants.every((variant) => {
      if (!isRecord(variant) || !isNonEmptyString(variant.id)) return false;
      if (!isMoney(variant.basePrice)) return false;
      if (!isRecord(variant.inventory)) return false;
      return (
        Number.isFinite(variant.inventory.onHand) && Number.isFinite(variant.inventory.reserved)
      );
    });
  });

  return usable ? (value as Product[]) : undefined;
}

function isOrderLike(value: unknown): value is Order {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.orderNumber)) return false;
  if (!isNonEmptyString(value.status)) return false;
  if (!Array.isArray(value.items)) return false;
  if (!isRecord(value.financials) || !isMoney(value.financials.totalPayable)) return false;
  return true;
}

function sanitizeOrders(value: unknown): Order[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.every(isOrderLike) ? (value as Order[]) : undefined;
}

function sanitizeOrder(value: unknown): Order | null | undefined {
  if (value === null) return null;
  return isOrderLike(value) ? value : undefined;
}

function sanitizeLedgerEntries(value: unknown): LedgerEntry[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const usable = value.every(
    (entry) => isRecord(entry) && isNonEmptyString(entry.id) && isMoney(entry.amount)
  );
  return usable ? (value as LedgerEntry[]) : undefined;
}

function sanitizeCart(value: unknown): PersistedCartLine[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const lines: PersistedCartLine[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    if (!isNonEmptyString(entry.productId) || !isNonEmptyString(entry.variantId)) continue;
    if (typeof entry.quantity !== 'number' || !Number.isFinite(entry.quantity)) continue;

    const quantity = Math.trunc(entry.quantity);
    if (quantity < 1) continue;

    lines.push({ productId: entry.productId, variantId: entry.variantId, quantity });
  }
  return lines;
}

function sanitizeProductIds(value: unknown): ProductId[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter(isNonEmptyString);
}

function sanitizeFeatureFlags(value: unknown): FeatureFlags | undefined {
  if (!isRecord(value)) return undefined;

  const flags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS };
  (Object.keys(DEFAULT_FEATURE_FLAGS) as (keyof FeatureFlags)[]).forEach((key) => {
    const stored = value[key];
    if (typeof stored === 'boolean') flags[key] = stored;
  });
  return flags;
}

function sanitizeCustomerInfo(
  value: unknown
): { name: string; phone: string; nationalCode: string } | undefined {
  if (!isRecord(value)) return undefined;

  const asString = (field: unknown) => (typeof field === 'string' ? field : '');
  return {
    name: asString(value.name),
    phone: asString(value.phone),
    nationalCode: asString(value.nationalCode),
  };
}

/**
 * A stored coupon is only a code: the terms always come back from the catalog, so a
 * coupon that was edited or retired since the visitor's last visit cannot keep applying
 * stale percentages, and a tampered payload cannot invent a discount.
 */
function sanitizeCoupon(value: unknown): Coupon | null | undefined {
  if (value === null) return null;
  if (!isRecord(value) || !isNonEmptyString(value.code)) return undefined;

  const catalogCoupon = VALID_COUPONS.find((coupon) => coupon.code === value.code);
  if (!catalogCoupon || !catalogCoupon.isActive) return null;
  return catalogCoupon;
}

function sanitizeCheckoutStep(value: unknown): number | undefined {
  if (!Number.isInteger(value)) return undefined;

  const step = value as number;
  if (step < FIRST_CHECKOUT_STEP || step > LAST_CHECKOUT_STEP) return undefined;
  return step;
}

function sanitizeId(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value : undefined;
}

// --- public API ---------------------------------------------------------------------

function pick<K extends keyof RestorableState>(
  target: RestorableState,
  key: K,
  value: RestorableState[K] | undefined
): void {
  if (value !== undefined) target[key] = value;
}

/**
 * Reads the stored state and returns only the slices that are structurally sound.
 * Returns null when there is nothing usable to read at all (no storage, unreadable,
 * corrupt JSON, oversized, or written by a different app version).
 */
export function loadPersistedState(): RestorableState | null {
  if (typeof window === 'undefined') return null;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode, enterprise policy).
    return null;
  }

  if (!raw || raw.length > MAX_PAYLOAD_BYTES) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION) return null;

  const restored: RestorableState = {};
  pick(restored, 'products', sanitizeProducts(parsed.products));
  pick(restored, 'cart', sanitizeCart(parsed.cart));
  pick(restored, 'activeCoupon', sanitizeCoupon(parsed.activeCoupon));
  pick(restored, 'orders', sanitizeOrders(parsed.orders));
  pick(restored, 'ledgerEntries', sanitizeLedgerEntries(parsed.ledgerEntries));
  pick(restored, 'featureFlags', sanitizeFeatureFlags(parsed.featureFlags));
  pick(restored, 'wishlistIds', sanitizeProductIds(parsed.wishlistIds));
  pick(restored, 'comparisonIds', sanitizeProductIds(parsed.comparisonIds));
  pick(restored, 'selectedAddressId', sanitizeId(parsed.selectedAddressId));
  pick(restored, 'selectedShippingMethodId', sanitizeId(parsed.selectedShippingMethodId));
  pick(restored, 'customerInfo', sanitizeCustomerInfo(parsed.customerInfo));
  pick(restored, 'checkoutStep', sanitizeCheckoutStep(parsed.checkoutStep));
  pick(restored, 'lastCreatedOrder', sanitizeOrder(parsed.lastCreatedOrder));
  pick(restored, 'selectedProductId', parsed.selectedProductId === null ? null : sanitizeId(parsed.selectedProductId));
  pick(restored, 'selectedVariantId', parsed.selectedVariantId === null ? null : sanitizeId(parsed.selectedVariantId));

  return restored;
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
