import React from "react";
import { Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/navigation/routes";
import type { UserListItem } from "@/types/models";

interface UserCardProps {
  user: UserListItem;
}

function UserCard({ user }: UserCardProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate(ROUTES.UserProfile, { userId: user.id })}
      accessibilityLabel={`View ${user.full_name}'s profile`}
      accessibilityRole="button"
      className="items-center mr-4 w-20"
    >
      <Avatar source={user.profile_photo} name={user.full_name} size={56} />
      <Text
        className="text-xs font-medium text-textPrimary mt-1 text-center"
        numberOfLines={1}
      >
        {user.full_name}
      </Text>
    </Pressable>
  );
}

export default React.memo(UserCard);
