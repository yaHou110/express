import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORDER_STATE_TRANSITIONS,
  canTransitionOrder,
  getOrderStatusColor,
  getOrderStatusLabel,
} from '../domain/stateMachine';
import { OrderStatus } from '../domain/types';

const ALL_STATUSES = Object.keys(ORDER_STATE_TRANSITIONS) as OrderStatus[];

test('every declared transition is allowed', () => {
  for (const from of ALL_STATUSES) {
    for (const to of ORDER_STATE_TRANSITIONS[from]) {
      const result = canTransitionOrder(from, to);
      assert.equal(result.allowed, true, `${from} -> ${to} should be allowed`);
      assert.equal(result.reason, undefined);
    }
  }
});

test('every transition that is not declared is rejected, with an explanation', () => {
  for (const from of ALL_STATUSES) {
    const allowedTargets = ORDER_STATE_TRANSITIONS[from];
    for (const to of ALL_STATUSES) {
      if (allowedTargets.includes(to)) continue;

      const result = canTransitionOrder(from, to);
      assert.equal(result.allowed, false, `${from} -> ${to} should be rejected`);
      assert.ok(result.reason && result.reason.length > 0, `${from} -> ${to} needs a reason`);
    }
  }
});

test('a status never transitions to itself', () => {
  for (const status of ALL_STATUSES) {
    const result = canTransitionOrder(status, status);
    assert.equal(result.allowed, false, `${status} -> ${status} should be rejected`);
  }
});

test('terminal statuses are terminal', () => {
  assert.deepEqual(ORDER_STATE_TRANSITIONS.CANCELLED, []);
  assert.deepEqual(ORDER_STATE_TRANSITIONS.REFUNDED, []);

  for (const to of ALL_STATUSES) {
    assert.equal(canTransitionOrder('CANCELLED', to).allowed, false);
    assert.equal(canTransitionOrder('REFUNDED', to).allowed, false);
  }
});

test('an illegal jump is refused with a Persian reason, not a raw enum', () => {
  const result = canTransitionOrder('CREATED', 'DELIVERED');

  assert.equal(result.allowed, false);
  assert.equal(result.reason?.includes('DELIVERED'), false, 'reason leaks the raw enum');
  assert.equal(result.reason?.includes('تحویل نهایی به مشتری'), true);
});

test('the happy path CREATED -> PAID -> SHIPPED -> DELIVERED is walkable', () => {
  const path: OrderStatus[] = ['CREATED', 'PAYMENT_PENDING', 'PAID', 'SHIPPED'];
  let current: OrderStatus = 'CREATED';

  for (const next of ['PAYMENT_PENDING', 'PAID', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] as OrderStatus[]) {
    assert.equal(canTransitionOrder(current, next).allowed, true, `${current} -> ${next}`);
    current = next;
  }

  assert.equal(canTransitionOrder(current, 'DELIVERED').allowed, true);
  assert.deepEqual(path.length, 4);
});

test('every status has a Persian label and a colour treatment', () => {
  for (const status of ALL_STATUSES) {
    const label = getOrderStatusLabel(status);
    assert.notEqual(label, status, `${status} falls through to the raw enum`);
    assert.ok(label.length > 1);

    const colour = getOrderStatusColor(status);
    for (const cls of [colour.bg, colour.text, colour.border]) {
      assert.ok(cls.startsWith('bg-') || cls.startsWith('text-') || cls.startsWith('border-'));
    }
  }
});

test('an unknown status degrades to its own name instead of throwing', () => {
  const unknown = 'NOT_A_REAL_STATUS' as OrderStatus;

  assert.equal(getOrderStatusLabel(unknown), 'NOT_A_REAL_STATUS');
  assert.equal(canTransitionOrder(unknown, 'PAID').allowed, false);
});
