/*
 * Barrel. Implementations live in ./skeletons/. Keeping this file so
 * existing imports (`@/components/ui/Skeleton`) keep working, including
 * the `import Skeleton from ...` default-export pattern used in 4 callers.
 */
export { default } from "./skeletons/Skeleton";
export {
  Skeleton,
  PostCardSkeleton,
  ProfileSkeleton,
  ProductCardSkeleton,
  ListItemSkeleton,
  FeedSkeleton,
} from "./skeletons";
