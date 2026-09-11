import { Money } from './money';

export type ProductId = string;
export type VariantId = string;
export type CategoryId = string;
export type BrandId = string;
export type OrderId = string;
export type CustomerId = string;
export type SKU = string;

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description?: string;
  iconName: string;
  productCount: number;
}

export interface Brand {
  id: BrandId;
  name: string;
  slug: string;
  originCountry: string;
  logoUrl?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
  group: 'مشخصات فیزیکی' | 'پردازنده و سخت‌افزار' | 'صفحه نمایش' | 'دوربین و باتری' | 'سایر ویژگی‌ها';
}

export interface ProductVariant {
  id: VariantId;
  sku: SKU;
  title: string;
  attributes: {
    colorName?: string;
    colorHex?: string;
    storage?: string;
    size?: string;
    warranty?: string;
  };
  basePrice: Money;
  salePrice?: Money; // discount price if available
  discountPercent?: number;
  inventory: {
    onHand: number;
    reserved: number;
    // available = onHand - reserved (invariant: must be >= 0)
  };
  weightGram?: number;
}

export interface Product {
  id: ProductId;
  title: string;
  subtitle: string;
  brand: Brand;
  category: Category;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specifications: ProductAttribute[];
  variants: ProductVariant[];
  badges?: ('پرفروش' | 'ویژه' | 'ارسال فوری' | 'گارانتی طلایی')[];
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
}

export interface CartItem {
  productId: ProductId;
  variantId: VariantId;
  quantity: number;
  // Dynamic snapshot computed during cart read
  product: Product;
  variant: ProductVariant;
  unitPrice: Money;
  subtotal: Money;
}

export interface Address {
  id: string;
  title: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  postalAddress: string;
  postalCode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'CREATED'           // ایجاد سفارش اولیه
  | 'PAYMENT_PENDING'   // در انتظار پرداخت
  | 'PAID'              // پرداخت موفق و ثبت شده
  | 'CONFIRMED'         // تایید سفارش توسط انبار
  | 'PROCESSING'        // در حال بسته‌بندی در انبار
  | 'SHIPPED'           // تحویل به ناوگان پست / کوریر
  | 'DELIVERED'         // تحویل داده شده به مشتری
  | 'CANCELLED'         // لغو شده
  | 'RETURN_REQUESTED'  // درخواست مرجوعی
  | 'REFUNDED';         // وجه مسترد شده

export interface OrderItemSnapshot {
  productId: ProductId;
  variantId: VariantId;
  productTitle: string;
  variantTitle: string;
  sku: SKU;
  image: string;
  unitPrice: Money;
  discount: Money;
  finalPrice: Money;
  quantity: number;
  total: Money;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: Money;
  estimatedDelivery: string;
  carrierType: 'EXPRESS' | 'POST' | 'FREIGHT';
}

export interface Order {
  id: OrderId;
  orderNumber: string; // e.g. VALA-2026-89412
  status: OrderStatus;
  customerId: CustomerId;
  customerName: string;
  customerPhone: string;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  items: OrderItemSnapshot[];
  financials: {
    itemsSubtotal: Money;
    shippingFee: Money;
    promotionalDiscount: Money;
    taxAmount: Money;
    totalPayable: Money;
  };
  paymentInfo?: {
    gateway: 'ZARINPAL' | 'MELLAT' | 'SAMAN' | 'VALA_INTERNAL';
    transactionTraceNumber: string;
    paidAt: string;
    idempotencyKey: string;
  };
  createdAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface LedgerEntry {
  id: string;
  transactionRef: string;
  orderId?: OrderId;
  accountType: 'CUSTOMER_PAYMENT' | 'PLATFORM_COMMISSION' | 'SELLER_CREDIT' | 'SHIPPING_CARRIER' | 'TAX_VAT' | 'REFUND_DEBIT';
  type: 'DEBIT' | 'CREDIT';
  amount: Money;
  description: string;
  timestamp: string;
}

export interface Coupon {
  code: string;
  description?: string;
  discountPercentage: number;
  maxDiscount?: Money;
  minOrderAmount?: Money;
  expiresAt: string;
  isActive: boolean;
}

export interface UserReview {
  id: string;
  productId: ProductId;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  pros: string[];
  cons: string[];
  isVerifiedBuyer: boolean;
  createdAt: string;
}

export interface FeatureFlags {
  // Tier A - Core
  coreStorefront: boolean;
  coreCatalog: boolean;
  coreCheckout: boolean;
  coreInventory: boolean;
  // Tier B - Advanced
  productComparison: boolean;
  wishlist: boolean;
  advancedStockReservation: boolean;
  orderStateMachine: boolean;
  financialLedger: boolean;
  // Tier C - Premium / Enterprise (Pre-configured Gating)
  marketplaceMultiVendor: boolean;
  multiWarehouse: boolean;
  b2bOrganization: boolean;
  aiCommerceInsights: boolean;
}
