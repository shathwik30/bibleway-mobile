import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChatStackParamList } from "@/types/navigation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ConversationListScreen from "@/features/chat/screens/ConversationListScreen";
import ChatRoomScreen from "@/features/chat/screens/ChatRoomScreen";
import NewChatScreen from "@/features/chat/screens/NewChatScreen";

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStackNavigator() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="ConversationList"
          component={ConversationListScreen}
        />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
