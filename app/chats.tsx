import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../constants/theme";

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
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
  },
  chatItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    alignItems: "center",
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  chatTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  chatPreview: {
    fontSize: 14,
    color: COLORS.textMuted,
    numberOfLines: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function ChatsScreen() {
  const router = useRouter();
  const conversations = useQuery(api.chat.getConversations);

  const handleChatPress = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  if (conversations === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton}>
            <MaterialIcons name="edit" size={20} color={COLORS.text} />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <MaterialIcons name="more-vert" size={20} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      {/* Chat List */}
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="chat-bubble-outline"
            size={64}
            color={COLORS.textMuted}
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.emptyText}>
            No messages yet. Start a conversation!
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.chatItem}
              onPress={() => handleChatPress(item._id)}
            >
              <Image
                source={{ uri: item.otherUser?.image }}
                style={styles.chatAvatar}
              />
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>
                    {item.otherUser?.username}
                  </Text>
                  <Text style={styles.chatTime}>
                    {formatTime(item.lastMessageAt)}
                  </Text>
                </View>
                <Text style={styles.chatPreview} numberOfLines={1}>
                  {item.lastMessage || "No messages yet"}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
