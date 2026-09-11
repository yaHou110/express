import test, { afterEach, beforeEach, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_PAYLOAD_BYTES,
  STORAGE_KEY,
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
  type PersistedState,
  type RestorableState,
} from '../services/persistence';
import { PRODUCTS, SHIPPING_METHODS } from '../data/catalogData';
import { DEFAULT_FEATURE_FLAGS } from '../domain/features';
import { INITIAL_ADDRESSES, INITIAL_LEDGER_ENTRIES, INITIAL_ORDERS } from '../data/initialState';

class FakeStorage {
  readonly store = new Map<string, string>();
  throwOnGet = false;
  throwOnSet = false;

  getItem(key: string): string | null {
    if (this.throwOnGet) throw new Error('SecurityError: storage access is blocked');
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    if (this.throwOnSet) throw new Error('QuotaExceededError');
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

let storage: FakeStorage;

function installBrowser(storageOrNull: FakeStorage | null): void {
  (globalThis as { window?: unknown }).window = storageOrNull
    ? { localStorage: storageOrNull }
    : undefined;
}

/** Seeds storage the way a tampered, stale or corrupted browser profile would. */
function seed(raw: string): void {
  storage.setItem(STORAGE_KEY, raw);
}

function seedJson(value: unknown): void {
  seed(JSON.stringify(value));
}

function validState(): PersistedState {
  return {
    version: 1,
    products: PRODUCTS,
    cart: [{ productId: 'prod-sony-wh1000xm5', variantId: 'var-wh5-blk', quantity: 2 }],
    activeCoupon: null,
    orders: INITIAL_ORDERS,
    ledgerEntries: INITIAL_LEDGER_ENTRIES,
    featureFlags: DEFAULT_FEATURE_FLAGS,
    wishlistIds: ['prod-iphone-16-pro'],
    comparisonIds: [],
    selectedAddressId: INITIAL_ADDRESSES[0].id,
    selectedShippingMethodId: SHIPPING_METHODS[0].id,
    customerInfo: { name: 'دانیال رادمنش', phone: '۰۹۱۲۳۴۵۶۷۸۹', nationalCode: '۰۰۱۲۳۴۵۶۷۸' },
    checkoutStep: 2,
    lastCreatedOrder: null,
    selectedProductId: 'prod-iphone-16-pro',
    selectedVariantId: 'var-iph16p-256-nat',
  };
}

/**
 * Mirrors exactly how the store provider consumes a restored payload. If any of these
 * throw, the real app white-screens on load — which is the failure we are guarding.
 */
function consumeLikeProvider(loaded: RestorableState | null): string[] {
  const applied: string[] = [];
  if (!loaded) return applied;

  if (loaded.products) {
    assert.doesNotThrow(() => loaded.products!.find((p) => p.id === 'nope'));
    assert.doesNotThrow(() => loaded.products!.forEach((p) => p.variants.length));
    applied.push('products');
  }
  if (loaded.cart) {
    assert.doesNotThrow(() => loaded.cart!.map((line) => line.quantity).reduce((a, b) => a + b, 0));
    applied.push('cart');
  }
  if (loaded.orders) {
    assert.doesNotThrow(() => loaded.orders!.map((order) => order.orderNumber));
    applied.push('orders');
  }
  if (loaded.ledgerEntries) {
    assert.doesNotThrow(() => loaded.ledgerEntries!.map((entry) => entry.amount.amount));
    applied.push('ledgerEntries');
  }
  if (loaded.wishlistIds) {
    assert.doesNotThrow(() => loaded.wishlistIds!.filter(Boolean));
    applied.push('wishlistIds');
  }
  if (loaded.comparisonIds) {
    assert.doesNotThrow(() => loaded.comparisonIds!.filter(Boolean));
    applied.push('comparisonIds');
  }
  if (loaded.featureFlags) {
    assert.doesNotThrow(() => Object.values(loaded.featureFlags!).filter(Boolean));
    applied.push('featureFlags');
  }
  if (loaded.activeCoupon) {
    assert.ok(
      Number.isFinite(loaded.activeCoupon.discountPercentage),
      'a non-numeric coupon would turn every cart total into NaN'
    );
    assert.ok(
      loaded.activeCoupon.maxDiscount === undefined ||
        Number.isFinite(loaded.activeCoupon.maxDiscount.amount),
      'a non-numeric discount cap would turn every cart total into NaN'
    );
    applied.push('activeCoupon');
  }
  if (loaded.checkoutStep !== undefined) {
    assert.ok(Number.isInteger(loaded.checkoutStep), 'checkout step must be a whole number');
    assert.ok(loaded.checkoutStep >= 1 && loaded.checkoutStep <= 4, 'checkout step out of range');
    applied.push('checkoutStep');
  }
  return applied;
}

/** Loads and then proves the result can be consumed by the provider without throwing. */
function loadAndConsume(): RestorableState | null {
  const loaded = loadPersistedState();
  consumeLikeProvider(loaded);
  return loaded;
}

beforeEach(() => {
  storage = new FakeStorage();
  installBrowser(storage);
});

afterEach(() => {
  installBrowser(null);
});

describe('persistence — happy path', () => {
  test('nothing stored yet reads as null', () => {
    assert.equal(loadPersistedState(), null);
  });

  test('a saved state round-trips through storage', () => {
    savePersistedState(validState());

    const loaded = loadAndConsume();
    assert.ok(loaded);
    assert.deepEqual(loaded.cart, validState().cart);
    assert.equal(loaded.orders?.length, INITIAL_ORDERS.length);
    assert.equal(loaded.ledgerEntries?.length, INITIAL_LEDGER_ENTRIES.length);
    assert.deepEqual(loaded.featureFlags, DEFAULT_FEATURE_FLAGS);
    assert.deepEqual(loaded.wishlistIds, ['prod-iphone-16-pro']);
    assert.equal(loaded.checkoutStep, 2);
  });

  test('a deliberately emptied cart stays empty instead of being dropped', () => {
    savePersistedState({ ...validState(), cart: [] });

    const loaded = loadAndConsume();
    assert.ok(loaded);
    assert.deepEqual(loaded.cart, []);
  });

  test('clearPersistedState removes the payload', () => {
    savePersistedState(validState());
    assert.notEqual(storage.getItem(STORAGE_KEY), null);

    clearPersistedState();
    assert.equal(storage.getItem(STORAGE_KEY), null);
    assert.equal(loadPersistedState(), null);
  });
});

describe('persistence — unusable payloads are ignored, not applied', () => {
  test('no window at all (server render) never touches storage', () => {
    installBrowser(null);
    savePersistedState(validState());

    assert.equal(loadPersistedState(), null);
    assert.doesNotThrow(() => clearPersistedState());
  });

  test('corrupt JSON is ignored', () => {
    seed('{"version":1,"cart":[{');

    assert.equal(loadPersistedState(), null);
  });

  test('foreign JSON is ignored', () => {
    for (const raw of ['[1,2,3]', 'null', 'true', '42', '"a string"', '{}']) {
      seed(raw);
      const loaded = loadAndConsume();
      assert.ok(loaded === null || loaded.cart === undefined, `accepted ${raw}`);
    }
  });

  test('a payload from an older or newer app version is ignored', () => {
    for (const version of [0, 2, -1, '1', null, undefined]) {
      seedJson({ ...validState(), version });
      assert.equal(loadPersistedState(), null, `version ${String(version)} was accepted`);
    }
  });

  test('a payload that is missing its containers falls back to defaults', () => {
    seedJson({ version: 1 });

    const loaded = loadAndConsume();
    assert.ok(loaded === null || Object.keys(loaded).length <= 1);
  });

  test('an oversized payload is rejected instead of parsed', () => {
    seed(`{"version":1,"pad":"${'x'.repeat(MAX_PAYLOAD_BYTES + 1)}"}`);

    assert.equal(loadPersistedState(), null);
  });

  test('storage that throws on read degrades to null', () => {
    storage.throwOnGet = true;

    assert.doesNotThrow(() => loadPersistedState());
    assert.equal(loadPersistedState(), null);
  });

  test('storage that rejects writes (quota, private mode) never breaks the app', () => {
    storage.throwOnSet = true;

    assert.doesNotThrow(() => savePersistedState(validState()));
    assert.doesNotThrow(() => clearPersistedState());
    assert.equal(storage.getItem(STORAGE_KEY), null);
  });
});

describe('persistence — hostile payloads must not reach the store', () => {
  const hostileSlices: Array<[string, Record<string, unknown>]> = [
    ['cart as a string', { cart: 'garbage' }],
    ['cart as a number', { cart: 42 }],
    ['cart as an object', { cart: { productId: 'x', quantity: 1 } }],
    ['cart as null', { cart: null }],
    ['products as a string', { products: 'abc' }],
    ['products as a number', { products: 7 }],
    ['products as an object', { products: { id: 'x' } }],
    ['orders as a string', { orders: 'abc' }],
    ['orders as an object', { orders: { id: 'x' } }],
    ['ledgerEntries as a string', { ledgerEntries: 'abc' }],
    ['ledgerEntries as an object', { ledgerEntries: {} }],
    ['wishlistIds as a string', { wishlistIds: 'prod-iphone-16-pro' }],
    ['wishlistIds as an object', { wishlistIds: { 0: 'prod-iphone-16-pro' } }],
    ['comparisonIds as a string', { comparisonIds: 'garbage' }],
    ['featureFlags as a string', { featureFlags: 'all-on' }],
    ['featureFlags as an array', { featureFlags: ['wishlist'] }],
    ['customerInfo as a string', { customerInfo: 'دانیال' }],
    ['activeCoupon as a string', { activeCoupon: 'VALA10' }],
    ['activeCoupon with a non-numeric percentage', { activeCoupon: { code: 'VALA10', discountPercentage: '10' } }],
    ['activeCoupon that no longer exists', { activeCoupon: { code: 'NOPE', discountPercentage: 90 } }],
    ['checkoutStep beyond the workflow', { checkoutStep: 99 }],
    ['checkoutStep below the workflow', { checkoutStep: 0 }],
    ['checkoutStep as a string', { checkoutStep: '2' }],
    ['checkoutStep as NaN', { checkoutStep: 'NaN' }],
  ];

  for (const [label, override] of hostileSlices) {
    test(`${label} is neutralised`, () => {
      seedJson({ ...validState(), ...override });

      const loaded = loadAndConsume();
      assert.ok(loaded === null || typeof loaded === 'object');

      for (const key of Object.keys(override)) {
        const restored = (loaded as Record<string, unknown> | null)?.[key];
        if (restored === undefined || restored === null) continue;

        if (key === 'cart' || key === 'wishlistIds' || key === 'comparisonIds') {
          assert.ok(Array.isArray(restored), `${key} reached the app as ${typeof restored}`);
        }
        if (key === 'checkoutStep') {
          assert.ok(Number.isInteger(restored), `checkoutStep reached the app as ${restored}`);
          assert.ok((restored as number) >= 1 && (restored as number) <= 4);
        }
        if (key === 'activeCoupon') {
          assert.ok(
            Number.isFinite((restored as { discountPercentage: number }).discountPercentage),
            'a coupon without a numeric percentage reached the app'
          );
        }
        if (key === 'customerInfo' || key === 'featureFlags') {
          assert.equal(Array.isArray(restored), false, `${key} reached the app as an array`);
          assert.equal(typeof restored, 'object', `${key} reached the app as ${typeof restored}`);
        }
      }
    });
  }

  test('garbage entries inside an otherwise valid cart are filtered out', () => {
    seedJson({
      ...validState(),
      cart: [
        null,
        'nope',
        42,
        { productId: 'prod-sony-wh1000xm5' },
        { productId: 'prod-sony-wh1000xm5', variantId: 'var-wh5-blk', quantity: 'two' },
        { productId: 'prod-sony-wh1000xm5', variantId: 'var-wh5-blk', quantity: 0 },
        { productId: 'prod-sony-wh1000xm5', variantId: 'var-wh5-blk', quantity: -3 },
        { productId: 7, variantId: 8, quantity: 1 },
      ],
    });

    const loaded = loadAndConsume();
    assert.ok(loaded);
    assert.deepEqual(loaded.cart ?? [], []);
  });

  test('a valid cart line survives alongside the garbage', () => {
    seedJson({
      ...validState(),
      cart: [
        'nope',
        { productId: 'prod-sony-wh1000xm5', variantId: 'var-wh5-blk', quantity: 3 },
        { productId: 'prod-iphone-16-pro', variantId: 'var-iph16p-256-nat', quantity: 1.7 },
      ],
    });

    const loaded = loadAndConsume();
    assert.equal(loaded?.cart?.length, 2);
    assert.equal(loaded?.cart?.[0].productId, 'prod-sony-wh1000xm5');
    assert.equal(loaded?.cart?.[1].quantity, 1, 'a fractional quantity must be normalised');
  });

  test('unknown extra keys are dropped rather than copied through', () => {
    seedJson({ ...validState(), injected: { evil: true }, __proto__: { polluted: true } });

    const loaded = loadAndConsume();
    assert.ok(loaded);
    assert.equal('injected' in loaded, false);
    assert.equal(({} as Record<string, unknown>).polluted, undefined);
  });

  test('a stale-version payload never overwrites the defaults', () => {
    seedJson({ ...validState(), version: 0, cart: [{ productId: 'prod-sony-wh1000xm5', variantId: 'var-wh5-blk', quantity: 9 }] });

    assert.equal(loadPersistedState(), null);
  });
});
