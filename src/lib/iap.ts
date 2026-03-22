import { Platform } from 'react-native';
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  type Purchase,
  type Product,
} from 'react-native-iap';

// Boost product IDs — must match App Store Connect / Google Play Console
export const BOOST_PRODUCT_IDS = [
  'boost_basic',
  'boost_standard',
  'boost_premium',
] as const;

export type BoostProductId = (typeof BOOST_PRODUCT_IDS)[number];

export async function initIAP(): Promise<void> {
  await initConnection();
}

export async function teardownIAP(): Promise<void> {
  await endConnection();
}

export async function getBoostProducts(): Promise<Product[]> {
  const products = await fetchProducts({ skus: [...BOOST_PRODUCT_IDS], type: 'in-app' });
  return (products ?? []) as Product[];
}

export interface PurchaseResult {
  receiptData: string;
  transactionId: string;
}

export async function purchaseBoost(productId: BoostProductId): Promise<PurchaseResult> {
  const result = await requestPurchase({
    request: {
      apple: { sku: productId },
      google: { skus: [productId] },
    },
    type: 'in-app',
  });

  const purchase: Purchase | null = Array.isArray(result) ? result[0] ?? null : result;

  if (!purchase) {
    throw new Error('Purchase was cancelled.');
  }

  const receiptData = purchase.purchaseToken ?? '';

  const transactionId = purchase.transactionId ?? '';

  if (!receiptData || !transactionId) {
    throw new Error('Invalid purchase data received.');
  }

  // Finish the transaction so the store doesn't re-deliver it
  await finishTransaction({ purchase, isConsumable: true });

  return { receiptData, transactionId };
}
