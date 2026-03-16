import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CACHE_DURATIONS } from '@/constants/api';
import { pageNumberNextPage } from '@/api/pagination';
import type { PaginatedResponse } from '@/types/api';
import type { ProductListItem, Product, Purchase } from '@/types/models';

export function useProducts(category?: string) {
  return useInfiniteQuery({
    queryKey: ['products', category],
    queryFn: ({ pageParam = 1 }) => {
      const params: Record<string, unknown> = { page: pageParam };
      if (category) params.category = category;
      return api.get<PaginatedResponse<ProductListItem>>(ENDPOINTS.shop.products, params);
    },
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
    ...CACHE_DURATIONS.shopProducts,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => api.get(ENDPOINTS.shop.productSearch, { q: query }),
    enabled: query.length >= 2,
  });
}

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.get<Product>(ENDPOINTS.shop.productDetail(productId)),
    ...CACHE_DURATIONS.shopProducts,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { product_id: string; platform: string; receipt_data: string; transaction_id: string }) =>
      api.post(ENDPOINTS.shop.purchaseCreate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function usePurchases() {
  return useInfiniteQuery({
    queryKey: ['purchases'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<Purchase>>(ENDPOINTS.shop.purchaseList, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useDownload(productId: string) {
  return useQuery({
    queryKey: ['download', productId],
    queryFn: () => api.get(ENDPOINTS.shop.download(productId)),
    enabled: false, // Manual trigger
  });
}
