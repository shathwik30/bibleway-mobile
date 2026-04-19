import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  type Purchase,
  type Product,
} from "react-native-iap";

export const BOOST_PRODUCT_IDS = [
  "boost_basic",
  "boost_standard",
  "boost_premium",
] as const;

export type BoostProductId = (typeof BOOST_PRODUCT_IDS)[number];

export interface PurchaseResult {
  receiptData: string;
  transactionId: string;
}

export async function initIAP(): Promise<void> {
  await initConnection();
}

export async function teardownIAP(): Promise<void> {
  await endConnection();
}

export async function getStoreProducts(skus: string[]): Promise<Product[]> {
  const products = await fetchProducts({ skus, type: "in-app" });
  return (products ?? []) as Product[];
}

export async function getBoostProducts(): Promise<Product[]> {
  return getStoreProducts([...BOOST_PRODUCT_IDS]);
}

async function executePurchase(
  appleProductId: string,
  googleProductId: string,
  isConsumable: boolean,
): Promise<PurchaseResult> {
  const result = await requestPurchase({
    request: {
      apple: { sku: appleProductId },
      google: { skus: [googleProductId] },
    },
    type: "in-app",
  });

  const purchase: Purchase | null = Array.isArray(result)
    ? (result[0] ?? null)
    : result;

  if (!purchase) {
    throw new Error("Purchase was cancelled.");
  }

  const receiptData = purchase.purchaseToken ?? "";
  const transactionId = purchase.transactionId ?? "";

  if (!receiptData || !transactionId) {
    throw new Error("Invalid purchase data received.");
  }

  await finishTransaction({ purchase, isConsumable });

  return { receiptData, transactionId };
}

export async function purchaseBoost(
  productId: BoostProductId,
): Promise<PurchaseResult> {
  return executePurchase(productId, productId, true);
}

export async function purchaseShopProduct(
  appleProductId: string,
  googleProductId: string,
): Promise<PurchaseResult> {
  return executePurchase(appleProductId, googleProductId, false);
}
