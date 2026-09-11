'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Product,
  ProductVariant,
  CartItem,
  Order,
  OrderStatus,
  LedgerEntry,
  Address,
  ShippingMethod,
  Coupon,
  FeatureFlags,
  ProductId,
  VariantId,
  OrderItemSnapshot,
} from '../domain/types';
import {
  Money,
  createMoney,
  addMoney,
  subtractMoney,
  calculateDiscount,
} from '../domain/money';
import { canTransitionOrder } from '../domain/stateMachine';
import { AppView, pathForView, productIdFromPath, viewForPath } from '../domain/views';
import { loadPersistedState, savePersistedState } from './persistence';
import { DEFAULT_FEATURE_FLAGS } from '../domain/features';
import { PRODUCTS, SHIPPING_METHODS, VALID_COUPONS } from '../data/catalogData';
import {
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_LEDGER_ENTRIES,
} from '../data/initialState';

export type { AppView };

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface StoreContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: ProductId | null;
  selectedVariantId: VariantId | null;
  navigateToProduct: (productId: ProductId, variantId?: VariantId) => void;

  // Catalog State
  products: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedBrandSlug: string | null;
  setSelectedBrandSlug: (slug: string | null) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (val: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
  filteredProducts: Product[];

  // Comparison & Wishlist
  comparisonIds: ProductId[];
  toggleComparison: (productId: ProductId) => void;
  clearComparison: () => void;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;
  wishlistIds: ProductId[];
  toggleWishlist: (productId: ProductId) => void;

  // Cart & Pricing Engine
  cartItems: CartItem[];
  addToCart: (productId: ProductId, variantId: VariantId, quantity?: number) => { success: boolean; error?: string };
  updateCartQuantity: (productId: ProductId, variantId: VariantId, newQuantity: number) => { success: boolean; error?: string };
  removeFromCart: (productId: ProductId, variantId: VariantId) => void;
  clearCart: () => void;
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: {
    itemsSubtotal: Money;
    promotionalDiscount: Money;
    shippingFee: Money;
    taxAmount: Money;
    totalPayable: Money;
  };

  // Checkout Workflow
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod;
  setSelectedShippingMethod: (m: ShippingMethod) => void;
  customerInfo: { name: string; phone: string; nationalCode: string };
  setCustomerInfo: (info: { name: string; phone: string; nationalCode: string }) => void;
  lastCreatedOrder: Order | null;
  processPaymentAndCreateOrder: (gateway: 'ZARINPAL' | 'MELLAT' | 'SAMAN') => { success: boolean; order?: Order; error?: string };

  // Orders & State Machine
  orders: Order[];
  selectedOrderForDetail: Order | null;
  setSelectedOrderForDetail: (order: Order | null) => void;
  transitionOrderStatus: (orderId: string, targetStatus: OrderStatus, note?: string) => { success: boolean; error?: string };

  // Inventory & Ledger (Admin Operations)
  ledgerEntries: LedgerEntry[];
  adjustStock: (productId: ProductId, variantId: VariantId, deltaOnHand: number, reason: string) => void;
  featureFlags: FeatureFlags;
  toggleFeatureFlag: (flagKey: keyof FeatureFlags) => void;

  // Toast notifications
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Navigation — the URL is the single source of truth for the active view.
  const router = useRouter();
  const pathname = usePathname();
  const currentView = viewForPath(pathname);
  const initialPathnameRef = useRef(pathname);

  const [selectedProductId, setSelectedProductId] = useState<ProductId | null>(
    () => productIdFromPath(pathname) ?? 'prod-iphone-16-pro'
  );
  const [selectedVariantId, setSelectedVariantId] = useState<VariantId | null>('var-iph16p-256-nat');

  // Views are pushed as real routes, so Back/Forward and deep links work.
  const setCurrentView = useCallback(
    (view: AppView) => {
      const target = pathForView(view, productIdFromPath(pathname) ?? selectedProductId);
      if (target === pathname) return;
      router.push(target);
    },
    [router, pathname, selectedProductId]
  );

  // Products Database
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Comparison & Wishlist
  const [comparisonIds, setComparisonIds] = useState<ProductId[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<ProductId[]>(['prod-iphone-16-pro', 'prod-sony-wh1000xm5']);

  // Cart & Coupons
  const [cartItemsState, setCartItemsState] = useState<{ productId: ProductId; variantId: VariantId; quantity: number }[]>([
    { productId: 'prod-sony-wh1000xm5', variantId: 'var-wh5-blk', quantity: 1 },
  ]);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Checkout
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [addresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(INITIAL_ADDRESSES[0]);
  const [shippingMethods] = useState<ShippingMethod[]>(SHIPPING_METHODS);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(SHIPPING_METHODS[0]);
  const [customerInfo, setCustomerInfo] = useState({
    name: 'دانیال رادمنش',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    nationalCode: '۰۰۱۲۳۴۵۶۷۸',
  });
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(INITIAL_ORDERS[0]);

  // Ledger & Features
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Persistence -----------------------------------------------------------------
  // Transactional state is restored once, after hydration, then written back on every
  // change. Restoring in an effect (never during render) keeps the server-rendered
  // HTML and the first client render identical, so there is no hydration mismatch.
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- Rehydrating browser-only storage has to
     happen after the first paint, otherwise the server HTML and the client's first render
     disagree and React reports a hydration mismatch. The alternative, useSyncExternalStore,
     would require moving every slice of this provider's state into an external store. */
  useEffect(() => {
    const saved = loadPersistedState();
    const routedProductId = productIdFromPath(initialPathnameRef.current);

    if (saved) {
      if (saved.products?.length) setProducts(saved.products);
      if (saved.cart) setCartItemsState(saved.cart);
      if (saved.activeCoupon !== undefined) setActiveCoupon(saved.activeCoupon);
      if (saved.orders?.length) setOrders(saved.orders);
      if (saved.ledgerEntries?.length) setLedgerEntries(saved.ledgerEntries);
      if (saved.featureFlags) setFeatureFlags(saved.featureFlags);
      if (saved.wishlistIds) setWishlistIds(saved.wishlistIds);
      if (saved.comparisonIds) setComparisonIds(saved.comparisonIds);
      if (saved.customerInfo) setCustomerInfo(saved.customerInfo);
      if (typeof saved.checkoutStep === 'number') setCheckoutStep(saved.checkoutStep);
      if (saved.lastCreatedOrder !== undefined) setLastCreatedOrder(saved.lastCreatedOrder);

      const savedAddress = INITIAL_ADDRESSES.find((a) => a.id === saved.selectedAddressId);
      if (savedAddress) setSelectedAddress(savedAddress);
      const savedShipping = SHIPPING_METHODS.find((m) => m.id === saved.selectedShippingMethodId);
      if (savedShipping) setSelectedShippingMethod(savedShipping);

      // The URL owns the product selection: a product route always wins over memory.
      const catalog = saved.products?.length ? saved.products : PRODUCTS;
      const productIdToRestore = routedProductId ?? saved.selectedProductId ?? null;
      const restored = catalog.find((p) => p.id === productIdToRestore);
      if (restored) {
        setSelectedProductId(restored.id);
        setSelectedVariantId(
          saved.selectedVariantId && restored.variants.some((v) => v.id === saved.selectedVariantId)
            ? saved.selectedVariantId
            : restored.variants[0]?.id ?? null
        );
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePersistedState({
      version: 1,
      products,
      cart: cartItemsState,
      activeCoupon,
      orders,
      ledgerEntries,
      featureFlags,
      wishlistIds,
      comparisonIds,
      selectedAddressId: selectedAddress.id,
      selectedShippingMethodId: selectedShippingMethod.id,
      customerInfo,
      checkoutStep,
      lastCreatedOrder,
      selectedProductId,
      selectedVariantId,
    });
  }, [
    hydrated,
    products,
    cartItemsState,
    activeCoupon,
    orders,
    ledgerEntries,
    featureFlags,
    wishlistIds,
    comparisonIds,
    selectedAddress,
    selectedShippingMethod,
    customerInfo,
    checkoutStep,
    lastCreatedOrder,
    selectedProductId,
    selectedVariantId,
  ]);

  /* eslint-enable react-hooks/set-state-in-effect */

  // ---------------------------------------------------------------------------------

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const navigateToProduct = (productId: ProductId, variantId?: VariantId) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod && prod.variants.length > 0) {
      setSelectedVariantId(variantId || prod.variants[0].id);
    }
    router.push(pathForView('product-detail', productId));
  };

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(query);
        const matchesBrand = product.brand.name.toLowerCase().includes(query);
        const matchesCat = product.category.name.toLowerCase().includes(query);
        const matchesSku = product.variants.some((v) => v.sku.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSubtitle && !matchesBrand && !matchesCat && !matchesSku) {
          return false;
        }
      }

      // Category
      if (selectedCategorySlug && product.category.slug !== selectedCategorySlug) {
        return false;
      }

      // Brand
      if (selectedBrandSlug && product.brand.slug !== selectedBrandSlug) {
        return false;
      }

      // In-stock invariant
      if (inStockOnly) {
        const hasStock = product.variants.some((v) => v.inventory.onHand - v.inventory.reserved > 0);
        if (!hasStock) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') {
        const minA = Math.min(...a.variants.map((v) => (v.salePrice || v.basePrice).amount));
        const minB = Math.min(...b.variants.map((v) => (v.salePrice || v.basePrice).amount));
        return minA - minB;
      }
      if (sortBy === 'price-desc') {
        const maxA = Math.max(...a.variants.map((v) => (v.salePrice || v.basePrice).amount));
        const maxB = Math.max(...b.variants.map((v) => (v.salePrice || v.basePrice).amount));
        return maxB - maxA;
      }
      return 0; // featured default
    });
  }, [products, searchQuery, selectedCategorySlug, selectedBrandSlug, inStockOnly, sortBy]);

  // Cart Items Hydration with live Product/Variant data
  const cartItems: CartItem[] = useMemo(() => {
    return cartItemsState
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) return null;

        const unitPrice = variant.salePrice || variant.basePrice;
        const subtotal = {
          amount: unitPrice.amount * item.quantity,
          currency: unitPrice.currency,
        };

        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          product,
          variant,
          unitPrice,
          subtotal,
        };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartItemsState, products]);

  // Cart Totals Calculation using Money value object
  const cartTotals = useMemo(() => {
    let rawSubtotalAmount = 0;
    cartItems.forEach((item) => {
      rawSubtotalAmount += item.subtotal.amount;
    });
    const itemsSubtotal = createMoney(rawSubtotalAmount);

    let promotionalDiscount = createMoney(0);
    if (activeCoupon) {
      const calculated = calculateDiscount(itemsSubtotal, activeCoupon.discountPercentage);
      let discAmount = calculated.discountAmount.amount;
      if (activeCoupon.maxDiscount && discAmount > activeCoupon.maxDiscount.amount) {
        discAmount = activeCoupon.maxDiscount.amount;
      }
      promotionalDiscount = createMoney(discAmount);
    }

    const shippingFee = cartItems.length > 0 ? selectedShippingMethod.cost : createMoney(0);
    const taxAmount = createMoney(0); // Tax abstraction, 0 for standard retail model

    const afterDiscount = subtractMoney(itemsSubtotal, promotionalDiscount);
    const totalPayable = addMoney(afterDiscount, shippingFee);

    return {
      itemsSubtotal,
      promotionalDiscount,
      shippingFee,
      taxAmount,
      totalPayable,
    };
  }, [cartItems, activeCoupon, selectedShippingMethod]);

  // Cart Operations with Inventory Invariant Check (Available = OnHand - Reserved)
  const addToCart = (productId: ProductId, variantId: VariantId, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { success: false, error: 'محصول یافت نشد.' };

    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return { success: false, error: 'تنوع کالای انتخابی نامعتبر است.' };

    const availableStock = variant.inventory.onHand - variant.inventory.reserved;
    const existingIndex = cartItemsState.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );
    const currentInCart = existingIndex >= 0 ? cartItemsState[existingIndex].quantity : 0;
    const requestedTotal = currentInCart + quantity;

    if (requestedTotal > availableStock) {
      showToast(
        `موجودی قابل سفارش این کالا ${availableStock} عدد است (موجودی فعلی در سبد: ${currentInCart} عدد)`,
        'error'
      );
      return {
        success: false,
        error: `موجودی ناکافی در انبار: حداکثر ${availableStock} عدد قابل سفارش است.`,
      };
    }

    setCartItemsState((prev) => {
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], quantity: requestedTotal };
        return next;
      }
      return [...prev, { productId, variantId, quantity }];
    });

    showToast(`کالای "${product.title.substring(0, 32)}..." به سبد خرید اضافه شد.`, 'success');
    return { success: true };
  };

  const updateCartQuantity = (productId: ProductId, variantId: VariantId, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variantId);
      return { success: true };
    }

    const product = products.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (!variant) return { success: false, error: 'تنوع نامعتبر' };

    const availableStock = variant.inventory.onHand - variant.inventory.reserved;
    if (newQuantity > availableStock) {
      showToast(`حداکثر موجودی قابل سفارش ${availableStock} عدد است.`, 'error');
      return { success: false, error: 'موجودی ناکافی' };
    }

    setCartItemsState((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    return { success: true };
  };

  const removeFromCart = (productId: ProductId, variantId: VariantId) => {
    setCartItemsState((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
    showToast('کالا از سبد خرید حذف شد.', 'info');
  };

  const clearCart = () => {
    setCartItemsState([]);
  };

  // Coupon Engine
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      return { success: false, message: 'کد تخفیف وارد شده معتبر نمی‌باشد.' };
    }

    if (!found.isActive) {
      return { success: false, message: 'این کد تخفیف منقضی شده است.' };
    }

    if (found.minOrderAmount && cartTotals.itemsSubtotal.amount < found.minOrderAmount.amount) {
      return {
        success: false,
        message: `حداقل مبلغ سفارش برای اعمال این کوپن ${found.minOrderAmount.amount.toLocaleString(
          'fa-IR'
        )} تومان است.`,
      };
    }

    setActiveCoupon(found);
    showToast(`کد تخفیف ${found.code} با ${found.discountPercentage}٪ تخفیف اعمال شد!`, 'success');
    return { success: true, message: `کد تخفیف ${found.code} با موفقیت اعمال گردید.` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('کد تخفیف حذف گردید.', 'info');
  };

  // Wishlist & Comparison
  const toggleComparison = (productId: ProductId) => {
    setComparisonIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showToast('حداکثر ۴ محصول را می‌توانید همزمان مقایسه کنید.', 'error');
        return prev;
      }
      showToast('محصول به جدول مقایسه اضافه شد.', 'success');
      return [...prev, productId];
    });
  };

  const clearComparison = () => {
    setComparisonIds([]);
  };

  const toggleWishlist = (productId: ProductId) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast('از لیست علاقه‌مندی‌ها حذف شد.', 'info');
        return prev.filter((id) => id !== productId);
      }
      showToast('به لیست علاقه‌مندی‌ها افزوده شد.', 'success');
      return [...prev, productId];
    });
  };

  // Checkout Execution with Idempotency Key, Immutable Snapshot & Ledger Entry
  const processPaymentAndCreateOrder = (gateway: 'ZARINPAL' | 'MELLAT' | 'SAMAN') => {
    if (cartItems.length === 0) {
      return { success: false, error: 'سبد خرید شما خالی است.' };
    }

    // Step 1: Validate stock availability again (server-side invariant)
    for (const item of cartItems) {
      const prod = products.find((p) => p.id === item.productId);
      const variant = prod?.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return { success: false, error: `کالای ${item.product.title} در انبار نامعتبر است.` };
      }
      const available = variant.inventory.onHand - variant.inventory.reserved;
      if (item.quantity > available) {
        return {
          success: false,
          error: `متاسفانه موجودی ${variant.title} در لحظه پرداخت تغییر کرده و ناکافی است.`,
        };
      }
    }

    // Step 2: Build immutable Order Item Snapshots
    const itemsSnapshot: OrderItemSnapshot[] = cartItems.map((item) => {
      const base = item.variant.basePrice;
      const sale = item.variant.salePrice || base;
      const discount = subtractMoney(base, sale);
      return {
        productId: item.productId,
        variantId: item.variantId,
        productTitle: item.product.title,
        variantTitle: item.variant.title,
        sku: item.variant.sku,
        image: item.product.images[0],
        unitPrice: base,
        discount,
        finalPrice: sale,
        quantity: item.quantity,
        total: item.subtotal,
      };
    });

    const orderId = `ord-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderNumber = `VALA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const traceNumber = `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const idempotencyKey = `idemp-${orderId}-${Date.now()}`;
    const timestampStr = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      status: 'PAID',
      customerId: 'cust-1001',
      customerName: customerInfo.name || 'کاربر مهمان',
      customerPhone: customerInfo.phone || '۰۹۱۲۰۰۰۰۰۰۰',
      shippingAddress: selectedAddress,
      shippingMethod: selectedShippingMethod,
      items: itemsSnapshot,
      financials: { ...cartTotals },
      paymentInfo: {
        gateway,
        transactionTraceNumber: traceNumber,
        paidAt: timestampStr,
        idempotencyKey,
      },
      createdAt: timestampStr,
      statusHistory: [
        { status: 'CREATED', timestamp: timestampStr, note: 'ثبت سفارش از طریق درگاه پرداخت' },
        { status: 'PAID', timestamp: timestampStr, note: `تایید تراکنش ${traceNumber} از سوی درگاه شاپرک` },
      ],
    };

    // Step 3: Atomic stock deduction (decrement onHand)
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingCartItems = cartItems.filter((ci) => ci.productId === prod.id);
        if (matchingCartItems.length === 0) return prod;

        const updatedVariants = prod.variants.map((variant) => {
          const cartItem = matchingCartItems.find((ci) => ci.variantId === variant.id);
          if (!cartItem) return variant;

          return {
            ...variant,
            inventory: {
              ...variant.inventory,
              onHand: Math.max(0, variant.inventory.onHand - cartItem.quantity),
            },
          };
        });

        return { ...prod, variants: updatedVariants };
      })
    );

    // Step 4: Record double-entry immutable Ledger Transactions
    const customerPaymentEntry: LedgerEntry = {
      id: `ledg-${Date.now()}-1`,
      transactionRef: traceNumber,
      orderId: newOrder.id,
      accountType: 'CUSTOMER_PAYMENT',
      type: 'CREDIT',
      amount: newOrder.financials.totalPayable,
      description: `دریافت وجه فاکتور ${newOrder.orderNumber} از مشتری از طریق درگاه ${gateway}`,
      timestamp: timestampStr,
    };

    const shippingAllocationEntry: LedgerEntry = {
      id: `ledg-${Date.now()}-2`,
      transactionRef: traceNumber,
      orderId: newOrder.id,
      accountType: 'SHIPPING_CARRIER',
      type: 'DEBIT',
      amount: newOrder.financials.shippingFee,
      description: `تخصیص کرایه حمل برای ارسال مرسوله توسط ${newOrder.shippingMethod.name}`,
      timestamp: timestampStr,
    };

    setLedgerEntries((prev) => [customerPaymentEntry, shippingAllocationEntry, ...prev]);

    // Step 5: Save order, clear cart, set active order
    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    setSelectedOrderForDetail(newOrder);
    clearCart();
    setCheckoutStep(4); // Move to confirmation step

    showToast(`پرداخت موفقیت‌آمیز بود! کد رهگیری سفارش: ${orderNumber}`, 'success');
    return { success: true, order: newOrder };
  };

  // Order State Machine Transition with validation
  const transitionOrderStatus = (orderId: string, targetStatus: OrderStatus, note?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return { success: false, error: 'سفارش یافت نشد.' };

    const validation = canTransitionOrder(targetOrder.status, targetStatus);
    if (!validation.allowed) {
      showToast(validation.reason || 'تغییر وضعیت نامعتبر است.', 'error');
      return { success: false, error: validation.reason };
    }

    const timestampStr = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: targetStatus,
          statusHistory: [
            ...ord.statusHistory,
            {
              status: targetStatus,
              timestamp: timestampStr,
              note: note || `تغییر وضعیت توسط واحد عملیات به ${targetStatus}`,
            },
          ],
        };
      })
    );

    // If order is refunded, record refund debit in financial ledger
    if (targetStatus === 'REFUNDED') {
      const refundEntry: LedgerEntry = {
        id: `ledg-${Date.now()}-ref`,
        transactionRef: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: targetOrder.id,
        accountType: 'REFUND_DEBIT',
        type: 'DEBIT',
        amount: targetOrder.financials.totalPayable,
        description: `استرداد وجه سفارش ${targetOrder.orderNumber} به شماره حساب شبای مشتری`,
        timestamp: timestampStr,
      };
      setLedgerEntries((prev) => [refundEntry, ...prev]);
    }

    showToast(`وضعیت سفارش ${targetOrder.orderNumber} با موفقیت به‌روزرسانی شد.`, 'success');
    return { success: true };
  };

  // Admin Stock Adjustment with audit trail
  const adjustStock = (productId: ProductId, variantId: VariantId, deltaOnHand: number, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => {
            if (v.id !== variantId) return v;
            const newOnHand = Math.max(v.inventory.reserved, v.inventory.onHand + deltaOnHand);
            return {
              ...v,
              inventory: {
                ...v.inventory,
                onHand: newOnHand,
              },
            };
          }),
        };
      })
    );
    showToast(`موجودی انبار تغییر کرد (${deltaOnHand > 0 ? '+' : ''}${deltaOnHand} عدد) - دلیل: ${reason}`, 'info');
  };

  // Feature Flag Gating
  const toggleFeatureFlag = (flagKey: keyof FeatureFlags) => {
    setFeatureFlags((prev) => {
      const nextVal = !prev[flagKey];
      showToast(`قابلیت ${String(flagKey)} ${nextVal ? 'فعال' : 'غیرفعال'} شد.`, 'info');
      return { ...prev, [flagKey]: nextVal };
    });
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        selectedVariantId,
        navigateToProduct,
        products,
        searchQuery,
        setSearchQuery,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedBrandSlug,
        setSelectedBrandSlug,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        filteredProducts,
        comparisonIds,
        toggleComparison,
        clearComparison,
        isComparisonOpen,
        setIsComparisonOpen,
        wishlistIds,
        toggleWishlist,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        cartTotals,
        checkoutStep,
        setCheckoutStep,
        addresses,
        selectedAddress,
        setSelectedAddress,
        shippingMethods,
        selectedShippingMethod,
        setSelectedShippingMethod,
        customerInfo,
        setCustomerInfo,
        lastCreatedOrder,
        processPaymentAndCreateOrder,
        orders,
        selectedOrderForDetail,
        setSelectedOrderForDetail,
        transitionOrderStatus,
        ledgerEntries,
        adjustStock,
        featureFlags,
        toggleFeatureFlag,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
