import { useMemo, useState } from "react";
import { Alert, Image as RNImage, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../constants/theme";
import { feedStyles } from "../styles/feed.styles";
import { formatDistanceToNow } from "date-fns";
import type { Id } from "../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { CommentsModal } from "./CommentsModal";

type PostAuthor = {
  _id?: string;
  fullname?: string;
  username?: string;
  image?: string;
};

export type FeedPost = {
  _id: Id<"posts">;
  _creationTime?: number;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  author?: PostAuthor | null;
};

export type PostProps = {
  post: FeedPost;
  currentUserId?: string | null;
};

export function Post({
  post,
  currentUserId,
}: PostProps) {
  const [isLiked, setIsLiked] = useState(!!post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(!!post.isBookmarked);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const deletePost = useMutation(api.posts.deletePost);

  const timeAgo = useMemo(() => {
    if (!post._creationTime) return null;
    return formatDistanceToNow(new Date(post._creationTime), { addSuffix: true });
  }, [post._creationTime]);

  const handleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => Math.max(0, nextLiked ? prev + 1 : prev - 1));

    try {
      const res = await toggleLike({ postId: post._id });
      setIsLiked(res.liked);
    } catch {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => Math.max(0, nextLiked ? prev - 1 : prev + 1));
    }
  };

  const handleBookmark = async () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      const res = await toggleBookmark({ postId: post._id });
      setIsBookmarked(res.bookmarked);
    } catch {
      setIsBookmarked((prev) => !prev);
    }
  };

  const isOwner = !!currentUserId && !!post.author?._id && currentUserId === post.author._id;

  const handleDelete = async () => {
    Alert.alert("Delete post?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost({ postId: post._id });
          } catch {
            Alert.alert("Failed to delete post");
          }
        },
      },
    ]);
  };

  return (
    <View style={feedStyles.postContainer}>
      <Link href={post.author?._id ? `/user/${post.author._id}` : "#"} asChild>
        <Pressable style={feedStyles.postHeader}>
          {post.author?.image ? (
            <RNImage source={{ uri: post.author.image }} style={feedStyles.avatar} />
          ) : (
            <View style={feedStyles.avatarFallback}>
              <MaterialIcons name="person" size={22} color={COLORS.textMuted} />
            </View>
          )}
          <View>
            <Text style={feedStyles.authorName}>
              {post.author?.fullname ?? "Unknown"}
            </Text>
            <Text style={feedStyles.authorHandle}>
              @{post.author?.username ?? "unknown"}
            </Text>
          </View>

          <Pressable onPress={isOwner ? handleDelete : undefined} style={{ marginLeft: "auto" }}>
            <MaterialIcons
              name={isOwner ? "delete-outline" : "more-horiz"}
              size={24}
              color={COLORS.textMuted}
            />
          </Pressable>
        </Pressable>
      </Link>

      <RNImage
        source={{ uri: post.imageUrl }}
        style={feedStyles.postImage}
        resizeMode="cover"
      />

      <View style={feedStyles.postActions}>
        <Pressable onPress={handleLike} style={feedStyles.actionGroup}>
          <MaterialIcons
            name={isLiked ? "favorite" : "favorite-border"}
            size={26}
            color={isLiked ? "#E0245E" : COLORS.text}
          />
          <Text style={feedStyles.actionCount}>{likesCount}</Text>
        </Pressable>

        <Pressable onPress={() => setShowComments(true)} style={feedStyles.actionGroup}>
          <MaterialIcons name="chat-bubble-outline" size={24} color={COLORS.text} />
          <Text style={feedStyles.actionCount}>{commentsCount}</Text>
        </Pressable>

        <Pressable onPress={handleBookmark} style={{ marginLeft: "auto" }}>
          <MaterialIcons
            name={isBookmarked ? "bookmark" : "bookmark-border"}
            size={26}
            color={isBookmarked ? COLORS.primary : COLORS.text}
          />
        </Pressable>
      </View>

      <View style={feedStyles.postInfo}>
        <Text style={feedStyles.likesText}>{likesCount} likes</Text>

        {post.caption ? (
          <Text style={feedStyles.caption}>
            <Text style={feedStyles.captionUsername}>
              {post.author?.username ?? "unknown"}{" "}
            </Text>
            {post.caption}
          </Text>
        ) : null}

        {commentsCount > 0 ? (
          <Pressable onPress={() => setShowComments(true)}>
            <Text style={feedStyles.viewCommentsText}>
              View all {commentsCount} comments
            </Text>
          </Pressable>
        ) : null}

        {timeAgo ? <Text style={feedStyles.timeText}>{timeAgo}</Text> : null}
      </View>

      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
}

