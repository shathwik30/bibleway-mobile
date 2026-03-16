import { LinkingOptions } from '@react-navigation/native';
import { DEEP_LINK_SCHEME, UNIVERSAL_LINK_PREFIX } from '@/constants/app';
import { RootStackParamList } from '@/types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [`${DEEP_LINK_SCHEME}://`, UNIVERSAL_LINK_PREFIX],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: {
            screens: {
              PostDetail: 'post/:postId',
              PrayerDetail: 'prayer/:prayerId',
              UserProfile: 'user/:userId',
            },
          },
          BibleTab: {
            screens: {
              SegregatedPageDetail: 'bible/page/:pageId',
            },
          },
          ShopTab: {
            screens: {
              ProductDetail: 'shop/product/:productId',
            },
          },
        },
      },
    },
  },
};
