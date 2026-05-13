import { Text, View } from "react-native";
import { feedStyles } from "../styles/feed.styles";

export type CommentAuthor = {
  username?: string;
};

export type CommentItem = {
  _id: string;
  content: string;
  author?: CommentAuthor | null;
};

export function Comment({ comment }: { comment: CommentItem }) {
  return (
    <View style={feedStyles.commentItem}>
      <Text style={feedStyles.commentText}>
        <Text style={feedStyles.commentAuthor}>
          {comment.author?.username ?? "unknown"}{" "}
        </Text>
        {comment.content}
      </Text>
    </View>
  );
}

