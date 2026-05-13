import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../../constants/theme";
import { Id } from "../../convex/_generated/dataModel";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 12,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messageGroup: {
    marginVertical: 8,
    flexDirection: "row",
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: "75%",
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
    marginRight: 12,
  },
  otherBubble: {
    backgroundColor: COLORS.surfaceLight,
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  messageText: {
    fontSize: 14,
  },
  ownText: {
    color: "#fff",
  },
  otherText: {
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
});

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const messages = useQuery(
    api.chat.getMessages,
    id ? { conversationId: id as Id<"conversations"> } : "skip"
  );
  const currentUser = useQuery(api.users.getCurrentUser);
  const sendMessage = useMutation(api.chat.sendMessage);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !id || isSending) return;

    const text = messageText.trim();
    setMessageText("");
    setIsSending(true);

    try {
      await sendMessage({
        conversationId: id as Id<"conversations">,
        content: text,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageText(text); // Restore text on error
    } finally {
      setIsSending(false);
    }
  };

  if (!messages || !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Get the other user from first message
  const otherUser =
    messages.length > 0
      ? messages[0].sender._id === currentUser._id
        ? messages.find((m) => m.sender._id !== currentUser._id)?.sender
        : messages[0].sender
      : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={COLORS.text}
            />
          </Pressable>
          {otherUser && (
            <>
              <Image
                source={{ uri: otherUser.image }}
                style={{ width: 32, height: 32, borderRadius: 16, marginLeft: 12 }}
              />
              <Text style={styles.headerTitle}>{otherUser.username}</Text>
            </>
          )}
        </View>
        <Pressable style={styles.headerRight}>
          <MaterialIcons name="call" size={20} color={COLORS.text} />
        </Pressable>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageGroup,
              item.sender._id === currentUser._id
                ? { justifyContent: "flex-end" }
                : { justifyContent: "flex-start" },
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                item.sender._id === currentUser._id
                  ? styles.ownBubble
                  : styles.otherBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender._id === currentUser._id
                    ? styles.ownText
                    : styles.otherText,
                ]}
              >
                {item.content}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        onEndReachedThreshold={0.3}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={COLORS.textMuted}
            value={messageText}
            onChangeText={setMessageText}
            editable={!isSending}
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendButton, isSending && { opacity: 0.5 }]}
            onPress={handleSendMessage}
            disabled={isSending || !messageText.trim()}
          >
            {isSending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialIcons name="send" size={18} color="#fff" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
