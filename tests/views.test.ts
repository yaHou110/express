import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCT_PATH_PREFIX,
  RoutableView,
  VIEW_PATHS,
  pathForView,
  productIdFromPath,
  viewForPath,
} from '../domain/views';

const ROUTABLE_VIEWS = Object.keys(VIEW_PATHS) as RoutableView[];

test('every routable view maps to a path and back again', () => {
  for (const view of ROUTABLE_VIEWS) {
    const path = pathForView(view);
    assert.equal(viewForPath(path), view, `${view} -> ${path} -> ${viewForPath(path)}`);
  }
});

test('no two views share a URL', () => {
  const paths = ROUTABLE_VIEWS.map((view) => VIEW_PATHS[view]);
  assert.equal(new Set(paths).size, paths.length, `duplicate paths in ${paths.join(', ')}`);
});

test('paths are absolute, lowercase and free of whitespace', () => {
  for (const view of ROUTABLE_VIEWS) {
    const path = VIEW_PATHS[view];
    assert.ok(path.startsWith('/'), `${view} is not absolute`);
    assert.equal(path, path.toLowerCase(), `${view} is not lowercase`);
    assert.equal(/\s/.test(path), false, `${view} contains whitespace`);
  }
});

test('the home view owns the root path', () => {
  assert.equal(VIEW_PATHS.home, '/');
  assert.equal(viewForPath('/'), 'home');
});

test('product detail is parameterised', () => {
  assert.equal(pathForView('product-detail', 'prod-sony-wh1000xm5'), '/product/prod-sony-wh1000xm5');
  assert.equal(viewForPath('/product/prod-sony-wh1000xm5'), 'product-detail');
  assert.equal(productIdFromPath('/product/prod-sony-wh1000xm5'), 'prod-sony-wh1000xm5');
});

test('product detail without an id falls back to the catalog instead of a broken link', () => {
  assert.equal(pathForView('product-detail'), VIEW_PATHS.catalog);
  assert.equal(pathForView('product-detail', null), VIEW_PATHS.catalog);
});

test('product ids survive encoding and a trailing slash', () => {
  const productId = 'prod with/slash & space';
  const path = pathForView('product-detail', productId);

  assert.equal(productIdFromPath(path), productId);
  assert.equal(productIdFromPath('/product/prod-iphone-16-pro/'), 'prod-iphone-16-pro');
  assert.equal(viewForPath('/product/prod-iphone-16-pro/'), 'product-detail');
});

test('non-product paths never claim a product id', () => {
  for (const path of ['/', '/cart', '/admin/orders', '/product', '/products/x']) {
    assert.equal(productIdFromPath(path), null, path);
  }
  assert.equal(viewForPath('/product'), 'home');
});

test('a trailing slash on a fixed path still resolves', () => {
  assert.equal(viewForPath('/cart/'), 'cart');
  assert.equal(viewForPath('/admin/orders/'), 'admin-orders');
});

test('an unrecognised path degrades to home rather than throwing', () => {
  assert.equal(viewForPath('/definitely-not-a-route'), 'home');
  assert.equal(viewForPath('/admin/nope'), 'home');
});

test('the product prefix matches the route directory', () => {
  assert.equal(PRODUCT_PATH_PREFIX, '/product/');
  assert.equal(pathForView('product-detail', 'x').startsWith(PRODUCT_PATH_PREFIX), true);
});
