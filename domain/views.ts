/**
 * Single source of truth for the mapping between an app view and its URL.
 * Keeping it in the domain layer (not in a component) is what lets the header,
 * the admin layout and the router agree on where a view lives.
 */

export type AppView =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'account'
  // Operations Admin Views
  | 'admin-dashboard'
  | 'admin-inventory'
  | 'admin-orders'
  | 'admin-ledger'
  | 'admin-features'
  // Tier C Enterprise Previews
  | 'preview-marketplace'
  | 'preview-b2b'
  | 'preview-warehouse';

export type RoutableView = Exclude<AppView, 'product-detail'>;

export const PRODUCT_PATH_PREFIX = '/product/';

/** Every view that has a fixed path. Product detail is parameterised, below. */
export const VIEW_PATHS: Record<RoutableView, string> = {
  home: '/',
  catalog: '/catalog',
  cart: '/cart',
  checkout: '/checkout',
  account: '/account',
  'admin-dashboard': '/admin',
  'admin-orders': '/admin/orders',
  'admin-inventory': '/admin/inventory',
  'admin-ledger': '/admin/ledger',
  'admin-features': '/admin/features',
  'preview-marketplace': '/enterprise/marketplace',
  'preview-b2b': '/enterprise/b2b',
  'preview-warehouse': '/enterprise/warehouse',
};

export function pathForView(view: AppView, productId?: string | null): string {
  if (view === 'product-detail') {
    return productId ? `${PRODUCT_PATH_PREFIX}${encodeURIComponent(productId)}` : VIEW_PATHS.catalog;
  }
  return VIEW_PATHS[view];
}

export function productIdFromPath(pathname: string): string | null {
  if (!pathname.startsWith(PRODUCT_PATH_PREFIX)) return null;
  const [id] = pathname.slice(PRODUCT_PATH_PREFIX.length).split('/');
  return id ? decodeURIComponent(id) : null;
}

export function viewForPath(pathname: string): AppView {
  if (productIdFromPath(pathname)) return 'product-detail';

  const normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const match = (Object.keys(VIEW_PATHS) as RoutableView[]).find((key) => VIEW_PATHS[key] === normalized);
  return match ?? 'home';
}
