import React, { useEffect, useRef } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  Theme,
  createNavigationContainerRef,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { linking } from "@/navigation/linking";
import type { RootStackParamList } from "@/types/navigation";

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#59021a",
    background: "#fcf9f8",
    card: "#ffffff",
    text: "#1c1b1b",
    border: "#dcc0c1",
  },
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isReady = useRef(false);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (!isReady.current || !navigationRef.isReady()) return;

        const data = response.notification.request.content.data;
        if (!data?.type) return;

        const nav = navigationRef as any;

        switch (data.type) {
          case "new_message":
          case "missed_call":
            if (data.conversation_id && data.sender) {
              const sender = data.sender as {
                id: string;
                full_name: string;
                profile_photo?: string | null;
                age?: number;
              };
              nav.navigate("Main", {
                screen: "ChatTab",
                params: {
                  screen: "ChatRoom",
                  params: {
                    conversationId: String(data.conversation_id),
                    otherUser: {
                      id: sender.id,
                      full_name: sender.full_name,
                      profile_photo: sender.profile_photo ?? null,
                      age: sender.age ?? 0,
                    },
                  },
                },
              });
            }
            break;
          case "follow":
            if (data.user_id) {
              nav.navigate("Main", {
                screen: "HomeTab",
                params: {
                  screen: "UserProfile",
                  params: { userId: String(data.user_id) },
                },
              });
            }
            break;
          case "reaction":
          case "comment":
          case "prayer_comment":
          case "share":
          case "boost_live":
          case "boost_digest":
            if (data.post_id) {
              nav.navigate("Main", {
                screen: "HomeTab",
                params: {
                  screen: "PostDetail",
                  params: { postId: String(data.post_id) },
                },
              });
            } else if (data.prayer_id) {
              nav.navigate("Main", {
                screen: "HomeTab",
                params: {
                  screen: "PrayerDetail",
                  params: { prayerId: String(data.prayer_id) },
                },
              });
            }
            break;
          case "reply":
            if (data.post_id) {
              nav.navigate("Main", {
                screen: "HomeTab",
                params: {
                  screen: "Comments",
                  params: {
                    contentType: "post",
                    objectId: String(data.post_id),
                  },
                },
              });
            } else if (data.prayer_id) {
              nav.navigate("Main", {
                screen: "HomeTab",
                params: {
                  screen: "Comments",
                  params: {
                    contentType: "prayer",
                    objectId: String(data.prayer_id),
                  },
                },
              });
            }
            break;
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={LightTheme}
      onReady={() => {
        isReady.current = true;
      }}
    >
      {children}
    </NavigationContainer>
  );
}
