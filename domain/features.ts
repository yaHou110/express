import { FeatureFlags } from './types';

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Tier A (Core)
  coreStorefront: true,
  coreCatalog: true,
  coreCheckout: true,
  coreInventory: true,
  // Tier B (Advanced)
  productComparison: true,
  wishlist: true,
  advancedStockReservation: true,
  orderStateMachine: true,
  financialLedger: true,
  // Tier C (Premium / Enterprise Previews)
  marketplaceMultiVendor: false, // preview mode available
  multiWarehouse: false,         // preview mode available
  b2bOrganization: false,        // preview mode available
  aiCommerceInsights: false,     // preview mode available
};

export interface PremiumFeatureMetadata {
  id: keyof FeatureFlags;
  title: string;
  subtitle: string;
  tier: 'TIER_C_ENTERPRISE' | 'TIER_B_ADVANCED';
  businessValue: string;
  architectureNotes: string;
  capabilities: string[];
}

export const PREMIUM_MODULES: Record<string, PremiumFeatureMetadata> = {
  marketplaceMultiVendor: {
    id: 'marketplaceMultiVendor',
    title: 'سیستم چندفروشندگی و تسویه‌حساب (Marketplace & Settlement)',
    subtitle: 'پورتال اختصاصی فروشندگان، کمیسیون‌گیری هوشمند، تسویه اتوماتیک با لجر مالی',
    tier: 'TIER_C_ENTERPRISE',
    businessValue: 'تبدیل پلتفرم تک‌فروشگاهی به بازارگاه ملی با جذب هزاران تامین‌کننده، تفکیک انبارها و تسهیم خودکار وجوه در شبکه شتاب بدون ریسک اضافه مالی.',
    architectureNotes: 'مبتنی بر مدل تغییرناپذیر Ledger Entry، تفکیک موجودیت SellerOrder از MasterOrder، و اعتبارسنجی سطح دسترسی مبتنی بر مالکیت منبع (Ownership Isolation).',
    capabilities: [
      'داشبورد اختصاصی فروشندگان با احراز هویت شرکتی (KYC)',
      'سیستم ثبت آفر و قیمت رقابتی (BuyBox Algorithm)',
      'محاسبه کمیسیون درصدی و ریالی بر اساس دسته‌بندی کالا',
      'مدیریت دوره‌های تسویه‌حساب هفتگی و ماهانه بر اساس وضعیت مرجوعی',
      'دفتر کل مالی حسابداری دوطرفه (Double-entry Ledger Audit)',
    ],
  },
  multiWarehouse: {
    id: 'multiWarehouse',
    title: 'لجستیک توزیع‌شده و انبارداری چندگانه (Multi-Warehouse Fulfillment)',
    subtitle: 'مسیریابی هوشمند کالاها، تخصیص بر اساس لوکیشن خریدار، کنترل موجودی خوشه‌ای',
    tier: 'TIER_C_ENTERPRISE',
    businessValue: 'کاهش زمان تحویل سفارشات به کمتر از ۲ ساعت با پردازش محلی از نزدیک‌ترین هاب توزیع و مدیریت بهینه موجودی در چندین شهر/انبار مجزا.',
    architectureNotes: 'مبتنی بر موجودیت‌های StockLocation، TransferRequest، و استراتژی هوشمند Split-Shipment در زمان تجمیع سبد خرید.',
    capabilities: [
      'تعریف بی‌نهایت انبار فیزیکی، هاب توزیع و فروشگاه حضوری (BOPIS)',
      'تفکیک موجودی On-Hand، Reserved و In-Transit بین انبارها',
      'الگوریتم تخصیص سفارش بر مبنای فاصله جغرافیایی و زمان تحویل',
      'سیستم بارکدخوان و عملیات انبارگردانی لحظه‌ای (Stock Count)',
    ],
  },
  b2bOrganization: {
    id: 'b2bOrganization',
    title: 'تجارت سازمانی B2B و پیش‌فاکتور (B2B Accounts & Quotation Engine)',
    subtitle: 'قیمت‌گذاری پلکانی حجمی، گردش‌کار تایید خرید شرکتی، اعتبار اسنادی',
    tier: 'TIER_C_ENTERPRISE',
    businessValue: 'امکان فروش عمده به سازمان‌ها و شرکت‌ها با فاکتور رسمی مورد تایید دارایی، سقف اعتبار دوره‌ای و سیستم تاییدیه چندمرحله‌ای مدیر مالی.',
    architectureNotes: 'طراحی شده با مدل OrganizationHierarchy، ApprovalWorkflowStateMachine و صدور پیش‌فاکتور رسمی پی‌دی‌اف منطبق بر استانداردهای مالیاتی.',
    capabilities: [
      'تعریف سازمان با سطوح خریدار، کارشناس تدارکات و مدیر مالی',
      'درخواست و صدور رسمی پیش‌فاکتور (Formal Quotation) با تاریخ اعتبار',
      'ماتریس تخفیف حجمی و قراردادهای قیمت‌گذاری اختصاصی برای هر شرکت',
      'تسویه‌حساب اعتباری (Credit Limit) با دوره بازپرداخت ۳۰ الی ۹۰ روزه',
    ],
  },
  aiCommerceInsights: {
    id: 'aiCommerceInsights',
    title: 'هوش تجاری و تحلیل تبدیل مبتنی بر داده (AI Merchandising & Conversion)',
    subtitle: 'پیشنهاد اقلام مکمل (Cross-sell)، تحلیل ریزش سبد، چیدمان بهینه فروشگاهی',
    tier: 'TIER_C_ENTERPRISE',
    businessValue: 'افزایش ۱۰ الی ۲۵ درصدی ارزش میانگین سفارشات (AOV) و کشف هوشمند روندهای فروش در فصول مختلف سال بدون فرآیندهای دستی کند.',
    architectureNotes: 'ایجاد لایه برداری از رفتار خرید کاربران، مدل‌سازی ماتریس همبستگی سبد کالاها، و استنتاج سمت سرور با حداقل تأخیر.',
    capabilities: [
      'موتور پیشنهاد هوشمند اقلام مکمل بر اساس تاریخچه سبدهای مشترک',
      'تحلیل علل ریزش سبد خرید (Cart Abandonment Deep Dive)',
      'پیش‌بینی اتمام موجودی و زمان بهینه سفارش‌گذاری به تامین‌کننده',
      'گزارش خودکار نقاط تماس کم‌بازده و پیشنهادات اصلاح قیمت',
    ],
  },
};
