import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import ProfileHeader from "@/components/profile/ProfileHeader";
import InfiniteList from "@/components/layout/InfiniteList";
import PostCard from "@/components/feed/PostCard";
import PrayerCard from "@/components/feed/PrayerCard";
import { useMyProfile } from "@/hooks/useProfile";
import { useUserPosts, useUserPrayers } from "@/hooks/useSocial";
import type { Post, Prayer } from "@/types/models";

type Tab = "posts" | "prayers";

export default function MyProfileScreen() {
  const navigation = useNavigation();
  const { data: profile, isLoading } = useMyProfile();
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const postsQuery = useUserPosts(profile?.id ?? "");
  const prayersQuery = useUserPrayers(profile?.id ?? "");

  if (isLoading || !profile) {
    return (
      <SafeAreaScreen>
        <ScreenHeader title="My Profile" />
        <ProfileSkeleton />
      </SafeAreaScreen>
    );
  }

  const tabBar = (
    <View>
      <ProfileHeader
        user={profile}
        isOwnProfile
        onEditPress={() => navigation.navigate("EditProfile")}
      />
      <View className="flex-row bg-surfaceContainerLow">
        <Pressable
          onPress={() => setActiveTab("posts")}
          className={`flex-1 items-center py-3 ${activeTab === "posts" ? "border-b-2 border-primary" : ""}`}
        >
          <Text
            className={`text-sm ${activeTab === "posts" ? "text-primary" : "text-textSecondary"}`}
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Posts
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("prayers")}
          className={`flex-1 items-center py-3 ${activeTab === "prayers" ? "border-b-2 border-primary" : ""}`}
        >
          <Text
            className={`text-sm ${activeTab === "prayers" ? "text-primary" : "text-textSecondary"}`}
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Prayers
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaScreen>
      <ScreenHeader
        title="My Profile"
        rightAction={
          <AnimatedPressable
            onPress={() => navigation.navigate("Settings")}
            accessibilityLabel="Settings"
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.primary.DEFAULT}
            />
          </AnimatedPressable>
        }
      />
      {activeTab === "posts" ? (
        <InfiniteList<Post>
          queryResult={postsQuery}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          headerComponent={tabBar}
          emptyTitle="No posts yet"
        />
      ) : (
        <InfiniteList<Prayer>
          queryResult={prayersQuery}
          renderItem={({ item }) => <PrayerCard prayer={item} />}
          keyExtractor={(item) => item.id}
          headerComponent={tabBar}
          emptyTitle="No prayers yet"
        />
      )}
    </SafeAreaScreen>
  );
}
