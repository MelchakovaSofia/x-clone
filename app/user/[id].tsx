import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../../constants/theme";
import { profileStyles } from "../../styles/profile.styles";
import { useState, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";

const COL_WIDTH = Dimensions.get("window").width / 3;

type FeedPost = {
  _id: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
};

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isMessagingLoading, setIsMessagingLoading] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);
  const getOrCreateConversation = useMutation(api.chat.getOrCreateConversation);

  // Check if viewing own profile
  useEffect(() => {
    if (currentUser && id === currentUser._id) {
      router.replace("/(tabs)/profile");
    }
  }, [currentUser, id, router]);

  const userProfile = useQuery(
    api.users.getUserProfile,
    id && id !== currentUser?._id ? { userId: id as Id<"users"> } : "skip"
  );
  const following = useQuery(
    api.users.isFollowing,
    id && id !== currentUser?._id ? { userId: id as Id<"users"> } : "skip"
  );
  const posts = useQuery(
    api.posts.getPostsByUser,
    id && id !== currentUser?._id ? { userId: id as Id<"users"> } : "skip"
  );

  const toggleFollow = useMutation(api.users.toggleFollow);

  const handleToggleFollow = async () => {
    if (!id || isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      await toggleFollow({ userId: id as Id<"users"> });
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!id || isMessagingLoading) return;
    setIsMessagingLoading(true);
    try {
      const conversationId = await getOrCreateConversation({
        userId: id as Id<"users">,
      });
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsMessagingLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <View
        style={[
          profileStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      {/* Header */}
      <View style={profileStyles.header}>
        <Pressable
          style={profileStyles.headerRight}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </Pressable>
        <View style={profileStyles.headerLeft}>
          <Text style={profileStyles.headerUsername}>@{userProfile?.username ?? "—"}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Info */}
      <FlatList
        data={posts ?? []}
        keyExtractor={(p) => p._id}
        numColumns={3}
        contentContainerStyle={profileStyles.gridContainer}
        columnWrapperStyle={{ gap: 0 }}
        ListHeaderComponent={
          <View style={profileStyles.profileInfoContainer}>
            {/* Avatar & Stats */}
            <View style={profileStyles.avatarContainer}>
              {userProfile?.image ? (
                <Image
                  source={{ uri: userProfile.image }}
                  style={profileStyles.avatar}
                />
              ) : (
                <View style={profileStyles.avatarFallback}>
                  <MaterialIcons
                    name="person"
                    size={36}
                    color={COLORS.textMuted}
                  />
                </View>
              )}
              <View style={profileStyles.statsContainer}>
                {[
                  { label: "Пості", value: userProfile?.posts ?? 0 },
                  { label: "Підписники", value: userProfile?.followers ?? 0 },
                  { label: "Підписки", value: userProfile?.following ?? 0 },
                ].map((s) => (
                  <View key={s.label} style={profileStyles.statItem}>
                    <Text style={profileStyles.statValue}>{s.value}</Text>
                    <Text style={profileStyles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Name & Bio */}
            <View style={profileStyles.nameContainer}>
              <Text style={profileStyles.name}>
                {userProfile?.fullname ?? "Користувач"}
              </Text>
              {userProfile?.bio ? (
                <Text style={profileStyles.bio}>{userProfile.bio}</Text>
              ) : null}
            </View>

            {/* Follow Button */}
            <View style={profileStyles.actionButtonsContainer}>
              <Pressable
                style={[
                  profileStyles.actionButton,
                  following
                    ? profileStyles.shareButton
                    : profileStyles.editButton,
                ]}
                onPress={handleToggleFollow}
                disabled={isFollowLoading}
              >
                {isFollowLoading ? (
                  <ActivityIndicator
                    color={following ? COLORS.text : "#fff"}
                    size="small"
                  />
                ) : (
                  <Text
                    style={
                      following
                        ? profileStyles.shareButtonText
                        : profileStyles.editButtonText
                    }
                  >
                    {following ? "Following" : "Follow"}
                  </Text>
                )}
              </Pressable>
              <Pressable
                style={[profileStyles.actionButton, profileStyles.editButton]}
                onPress={handleMessage}
                disabled={isMessagingLoading}
              >
                {isMessagingLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={profileStyles.editButtonText}>Message</Text>
                )}
              </Pressable>
              <Pressable
                style={[profileStyles.actionButton, profileStyles.shareButton]}
              >
                <MaterialIcons name="share" size={20} color={COLORS.text} />
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={profileStyles.noPostsText}>Постів ще немає</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedPost(item)}
            style={profileStyles.gridItem}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{ flex: 1 }}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />

      {/* Selected Post Modal */}
      {selectedPost && (
        <View
          style={[
            profileStyles.postModalContent,
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
          ]}
        >
          <Image
            source={{ uri: selectedPost.imageUrl }}
            style={profileStyles.postModalImage}
          />
          <Pressable
            style={profileStyles.postModalCloseButton}
            onPress={() => setSelectedPost(null)}
          >
            <MaterialIcons name="close" size={28} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
