import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import { COLORS } from "../constants/theme";
import { feedStyles } from "../styles/feed.styles";
import { Comment, type CommentItem } from "./Comment";

export function CommentsModal({
  postId,
  visible,
  onClose,
}: {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState("");

  const comments = useQuery(
    api.comments.getComments,
    visible ? { postId } : "skip",
  );
  const addComment = useMutation(api.comments.addComment);

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await addComment({ postId, content: trimmed });
    setText("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={feedStyles.modalBackdrop}
      >
        <View style={feedStyles.modalSheet}>
          <View style={feedStyles.modalHeader}>
            <Text style={feedStyles.modalTitle}>Коментарі</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} color={COLORS.text} />
            </Pressable>
          </View>

          <FlatList
            data={(comments ?? []) as unknown as CommentItem[]}
            keyExtractor={(c) => c._id}
            style={{ paddingHorizontal: 16 }}
            ListEmptyComponent={
              <Text
                style={{
                  color: COLORS.textMuted,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Коментарів ще немає
              </Text>
            }
            renderItem={({ item }) => <Comment comment={item} />}
          />

          <View style={feedStyles.commentInputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Написати коментар..."
              placeholderTextColor={COLORS.textMuted}
              style={feedStyles.commentInput}
            />
            <Pressable onPress={handleAdd}>
              <MaterialIcons name="send" size={24} color={COLORS.primary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

