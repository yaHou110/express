import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addMoney,
  calculateDiscount,
  createMoney,
  formatMoney,
  multiplyMoney,
  subtractMoney,
} from '../domain/money';

test('createMoney keeps amounts integral so invoices never carry float drift', () => {
  assert.equal(createMoney(10.4).amount, 10);
  assert.equal(createMoney(10.5).amount, 11);
  assert.equal(createMoney(94_900_000).amount, 94_900_000);
  assert.equal(createMoney(0.1 + 0.2).amount, 0);
});

test('createMoney defaults to TOMAN and accepts IRR', () => {
  assert.equal(createMoney(1).currency, 'TOMAN');
  assert.equal(createMoney(1, 'IRR').currency, 'IRR');
});

test('addMoney sums same-currency amounts and refuses mixed currency', () => {
  assert.equal(addMoney(createMoney(120), createMoney(80)).amount, 200);
  assert.throws(() => addMoney(createMoney(1), createMoney(1, 'IRR')), /Currency mismatch/);
});

test('subtractMoney clamps at zero and refuses mixed currency', () => {
  assert.equal(subtractMoney(createMoney(200), createMoney(50)).amount, 150);
  assert.equal(subtractMoney(createMoney(50), createMoney(200)).amount, 0);
  assert.throws(() => subtractMoney(createMoney(1), createMoney(1, 'IRR')), /Currency mismatch/);
});

test('multiplyMoney rounds to whole tomans', () => {
  assert.equal(multiplyMoney(createMoney(1_000), 3).amount, 3_000);
  assert.equal(multiplyMoney(createMoney(999), 1.5).amount, 1499);
});

test('summing a cart never drifts away from exact integer arithmetic', () => {
  const unit = createMoney(9_876_543);
  const lines = [3, 1, 7, 2].map((qty) => multiplyMoney(unit, qty));
  const total = lines.reduce(addMoney, createMoney(0));

  assert.equal(total.amount, 9_876_543 * 13);
  assert.ok(Number.isInteger(total.amount));
});

test('calculateDiscount computes the percentage and the payable remainder', () => {
  const basket = createMoney(112_300_000);
  const { discountAmount, payablePrice } = calculateDiscount(basket, 10);

  assert.equal(discountAmount.amount, 11_230_000);
  assert.equal(payablePrice.amount, 112_300_000 - 11_230_000);
  assert.equal(discountAmount.currency, 'TOMAN');
});

test('calculateDiscount with zero percent leaves the price untouched', () => {
  const basket = createMoney(5_000);
  const { discountAmount, payablePrice } = calculateDiscount(basket, 0);

  assert.equal(discountAmount.amount, 0);
  assert.equal(payablePrice.amount, 5_000);
});

test('formatMoney renders Persian digits with the toman suffix', () => {
  const formatted = formatMoney(createMoney(94_900_000));

  assert.ok(formatted.endsWith('تومان'), formatted);
  assert.equal(formatted.replace(/[۰-۹٬,\s\u200c]|تومان/g, ''), '');
  assert.equal(formatMoney(0).includes('0'), false);
});
