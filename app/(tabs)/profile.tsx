import { useClerk, useUser } from "@clerk/clerk-expo";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../../constants/theme";
import { profileStyles } from "../../styles/profile.styles";
import { useState, useMemo } from "react";
import { Link } from "expo-router";

const COL_WIDTH = Dimensions.get("window").width / 3;

type FeedPost = {
  _id: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
};

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const dbUser = useQuery(api.users.getCurrentUser);
  const posts = useQuery(
    api.posts.getPostsByUser,
    dbUser ? { userId: dbUser._id } : "skip"
  );

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [editName, setEditName] = useState(dbUser?.fullname ?? "");
  const [editBio, setEditBio] = useState(dbUser?.bio ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = useMutation(api.users.updateProfile);

  // Update edit fields when dbUser changes
  useMemo(() => {
    if (dbUser) {
      setEditName(dbUser.fullname);
      setEditBio(dbUser.bio || "");
    }
  }, [dbUser]);

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      await updateProfile({
        fullname: editName.trim(),
        bio: editBio.trim(),
      });
      setEditModalVisible(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled =
    isSaving ||
    !editName.trim() ||
    (editName === dbUser?.fullname && editBio === (dbUser?.bio || ""));

  return (
    <View style={profileStyles.container}>
      {/* Header */}
      <View style={profileStyles.header}>
        <View style={profileStyles.headerLeft}>
          <Text style={profileStyles.headerUsername}>@{dbUser?.username ?? "—"}</Text>
        </View>
        <Pressable style={profileStyles.headerRight} onPress={() => signOut()}>
          <MaterialIcons name="logout" size={24} color={COLORS.primary} />
        </Pressable>
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
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
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
                  { label: "Пости", value: dbUser?.posts ?? 0 },
                  { label: "Підписники", value: dbUser?.followers ?? 0 },
                  { label: "Підписки", value: dbUser?.following ?? 0 },
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
                {dbUser?.fullname ?? "Користувач"}
              </Text>
              {dbUser?.bio ? (
                <Text style={profileStyles.bio}>{dbUser.bio}</Text>
              ) : null}
            </View>

            {/* Action Buttons */}
            <View style={profileStyles.actionButtonsContainer}>
              <Pressable
                style={[profileStyles.actionButton, profileStyles.editButton]}
                onPress={handleEditProfile}
              >
                <Text style={profileStyles.editButtonText}>Edit Profile</Text>
              </Pressable>
              <Link href="/chats" asChild>
                <Pressable
                  style={[profileStyles.actionButton, profileStyles.shareButton]}
                >
                  <MaterialIcons name="chat" size={20} color={COLORS.text} />
                </Pressable>
              </Link>
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

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={profileStyles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={profileStyles.container}>
              {/* Modal Header */}
              <View style={profileStyles.modalHeader}>
                <Text style={profileStyles.modalTitle}>Edit Profile</Text>
                <Pressable
                  style={profileStyles.closeButton}
                  onPress={() => {
                    setEditName(dbUser?.fullname ?? "");
                    setEditBio(dbUser?.bio ?? "");
                    setEditModalVisible(false);
                  }}
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={COLORS.textMuted}
                  />
                </Pressable>
              </View>

              {/* Form */}
              <View style={{ flex: 1, paddingHorizontal: 16 }}>
                {/* Name Input */}
                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={profileStyles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={COLORS.textMuted}
                    value={editName}
                    onChangeText={setEditName}
                    maxLength={50}
                  />
                  <Text style={profileStyles.charCounter}>
                    {editName.length}/50
                  </Text>
                </View>

                {/* Bio Input */}
                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[profileStyles.input, { minHeight: 80 }]}
                    placeholder="Tell us about yourself"
                    placeholderTextColor={COLORS.textMuted}
                    value={editBio}
                    onChangeText={setEditBio}
                    maxLength={160}
                    multiline
                    numberOfLines={4}
                  />
                  <Text style={profileStyles.charCounter}>
                    {editBio.length}/160
                  </Text>
                </View>

                {/* Save Button */}
                <Pressable
                  style={[
                    profileStyles.saveButton,
                    isSaveDisabled && profileStyles.saveButtonDisabled,
                  ]}
                  onPress={handleSaveProfile}
                  disabled={isSaveDisabled}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={[
                        profileStyles.saveButtonText,
                        isSaveDisabled &&
                          profileStyles.saveButtonDisabledText,
                      ]}
                    >
                      Save Changes
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Selected Post Modal */}
      <Modal visible={!!selectedPost} animationType="fade" transparent>
        <View style={profileStyles.postModalContent}>
          {selectedPost && (
            <Image
              source={{ uri: selectedPost.imageUrl }}
              style={profileStyles.postModalImage}
            />
          )}
          <Pressable
            style={profileStyles.postModalCloseButton}
            onPress={() => setSelectedPost(null)}
          >
            <MaterialIcons name="close" size={28} color="#fff" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
