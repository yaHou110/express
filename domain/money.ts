export interface Money {
  readonly amount: number; // in Tomans (تومان) - strictly integer, no floating-point rounding errors
  readonly currency: 'TOMAN' | 'IRR';
}

export function createMoney(amount: number, currency: 'TOMAN' | 'IRR' = 'TOMAN'): Money {
  return {
    amount: Math.round(amount),
    currency,
  };
}

export function formatMoney(money: Money | number): string {
  const amount = typeof money === 'number' ? money : money.amount;
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} تومان`;
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Currency mismatch in addMoney');
  }
  return {
    amount: a.amount + b.amount,
    currency: a.currency,
  };
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Currency mismatch in subtractMoney');
  }
  return {
    amount: Math.max(0, a.amount - b.amount),
    currency: a.currency,
  };
}

export function multiplyMoney(money: Money, multiplier: number): Money {
  return {
    amount: Math.round(money.amount * multiplier),
    currency: money.currency,
  };
}

export function calculateDiscount(basePrice: Money, discountPercent: number): {
  discountAmount: Money;
  payablePrice: Money;
} {
  const discountAmount = Math.round((basePrice.amount * discountPercent) / 100);
  return {
    discountAmount: { amount: discountAmount, currency: basePrice.currency },
    payablePrice: { amount: basePrice.amount - discountAmount, currency: basePrice.currency },
  };
}
