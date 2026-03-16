import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { CACHE_DURATIONS } from '@/constants/api';
import { pageNumberNextPage } from '@/api/pagination';
import type { PaginatedResponse } from '@/types/api';
import type { UserProfile, UserPublicProfile, UserListItem, FollowRelationship, BlockRelationship } from '@/types/models';

export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => api.get<UserProfile>(ENDPOINTS.profile.me),
    ...CACHE_DURATIONS.profile,
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.get<UserPublicProfile>(ENDPOINTS.profile.userDetail(userId)),
    ...CACHE_DURATIONS.profile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: FormData | Record<string, any>) =>
      api.patch<UserProfile>(ENDPOINTS.profile.me, data),
    onSuccess: (data) => {
      setUser(data as UserProfile);
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => api.get<UserListItem[]>(ENDPOINTS.profile.userSearch, { q: query }),
    enabled: query.length >= 2,
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.post(ENDPOINTS.profile.follow(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.delete(ENDPOINTS.profile.follow(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useFollowers(userId: string) {
  return useInfiniteQuery({
    queryKey: ['followers', userId],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<FollowRelationship>>(ENDPOINTS.profile.followers(userId), { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useFollowing(userId: string) {
  return useInfiniteQuery({
    queryKey: ['following', userId],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<FollowRelationship>>(ENDPOINTS.profile.following(userId), { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useFollowRequests() {
  return useInfiniteQuery({
    queryKey: ['followRequests'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<FollowRelationship>>(ENDPOINTS.profile.followRequests, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function useRespondFollowRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, action }: { userId: string; action: 'accept' | 'reject' }) => {
      if (action === 'accept') {
        return api.post(ENDPOINTS.profile.followRequestRespond(userId));
      }
      return api.delete(ENDPOINTS.profile.followRequestRespond(userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followRequests'] });
    },
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.post(ENDPOINTS.profile.block(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.delete(ENDPOINTS.profile.block(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
    },
  });
}

export function useBlockedUsers() {
  return useInfiniteQuery({
    queryKey: ['blockedUsers'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<BlockRelationship>>(ENDPOINTS.profile.blockedUsers, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: pageNumberNextPage,
  });
}

export function usePrivacySettings() {
  return useQuery({
    queryKey: ['privacy'],
    queryFn: () => api.get(ENDPOINTS.profile.privacy),
  });
}

export function useUpdatePrivacy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { account_visibility?: string; hide_followers_list?: boolean }) =>
      api.put(ENDPOINTS.profile.privacy, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
