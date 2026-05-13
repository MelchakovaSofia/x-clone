import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { formatDistanceToNow } from "date-fns";
import { notificationsStyles } from "../../styles/notifications.styles";
import { COLORS } from "../../constants/theme";

const TYPE_ICON = {
  like: { name: "favorite" as const, color: "#E0245E" },
  comment: { name: "chat-bubble" as const, color: COLORS.primary },
  follow: { name: "person-add" as const, color: "#17BF63" },
};

type NotificationType = "like" | "comment" | "follow";

type NotificationSender = {
  username?: string;
  image?: string;
};

type NotificationComment = {
  content?: string;
};

type NotificationPost = {
  imageUrl?: string;
};

type NotificationItemData = {
  _id: string;
  _creationTime?: number;
  type: NotificationType;
  senderId?: string;
  sender?: NotificationSender | null;
  comment?: NotificationComment | null;
  post?: NotificationPost | null;
};

const TYPE_TEXT = {
  like: "вподобав(ла) ваш пост",
  comment: "прокоментував(ла) ваш пост",
  follow: "підписався(лась) на вас",
};

function formatTimeAgo(time?: number) {
  if (!time) return "";
  return formatDistanceToNow(new Date(time), { addSuffix: true });
}

function NoNotificationsFound() {
  return <Text style={notificationsStyles.emptyText}>Сповіщень ще немає</Text>;
}

function NotificationItem({ item }: { item: NotificationItemData }) {
  const icon = TYPE_ICON[item.type];
  const timeAgo = useMemo(
    () => formatTimeAgo(item._creationTime),
    [item._creationTime],
  );

  return (
    <Link href={item.senderId ? `/user/${item.senderId}` : "#"} asChild>
      <Pressable style={notificationsStyles.itemRow}>
        <View style={notificationsStyles.avatarWrapper}>
          {item.sender?.image ? (
            <Image
              source={{ uri: item.sender.image }}
              style={notificationsStyles.avatar}
            />
          ) : (
            <View style={notificationsStyles.avatarFallback}>
              <MaterialIcons name="person" size={22} color={COLORS.textMuted} />
            </View>
          )}
          <View
            style={[
              notificationsStyles.iconBadge,
              { backgroundColor: icon.color },
            ]}
          >
            <MaterialIcons name={icon.name} size={14} color="#fff" />
          </View>
        </View>

        <View style={notificationsStyles.itemContent}>
          <Text style={notificationsStyles.notificationText}>
            <Text style={notificationsStyles.senderName}>
              {item.sender?.username ?? "Хтось"}
            </Text>
            <Text style={notificationsStyles.messageText}> {TYPE_TEXT[item.type]}</Text>
          </Text>

          {item.comment?.content ? (
            <Text style={notificationsStyles.commentText}>
              {`"${item.comment.content}"`}
            </Text>
          ) : null}

          {timeAgo ? (
            <Text style={notificationsStyles.timeText}>{timeAgo}</Text>
          ) : null}
        </View>

        {item.post?.imageUrl ? (
          <Image
            source={{ uri: item.post.imageUrl }}
            style={notificationsStyles.postPreview}
          />
        ) : null}
      </Pressable>
    </Link>
  );
}

export default function NotificationsScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const notifications = useQuery(
    api.notifications.getNotifications,
    isSignedIn ? {} : "skip",
  );

  if (!isLoaded || notifications === undefined) {
    return (
      <View style={notificationsStyles.loader}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={notificationsStyles.screen}>
      <Text style={notificationsStyles.header}>Сповіщення</Text>
      <FlatList
        data={notifications}
        keyExtractor={(n) => n._id}
        contentContainerStyle={notificationsStyles.listContent}
        ListEmptyComponent={<NoNotificationsFound />}
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </View>
  );
}
