import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChatStackParamList } from "@/types/navigation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ConversationListScreen from "@/screens/chat/ConversationListScreen";
import ChatRoomScreen from "@/screens/chat/ChatRoomScreen";
import NewChatScreen from "@/screens/chat/NewChatScreen";

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
        <Stack.Screen name="ConversationList" component={ConversationListScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
