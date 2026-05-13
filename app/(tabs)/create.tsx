import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { File } from "expo-file-system";
import { fetch } from "expo/fetch";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useUser } from "@clerk/clerk-expo";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { createStyles } from "../../styles/create.styles";

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Потрібен доступ до галереї");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleShare = async () => {
    if (!selectedImage || isSharing) return;

    setIsSharing(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const file = new File(selectedImage);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }
      const { storageId } = (await uploadResponse.json()) as {
        storageId: Id<"_storage">;
      };

      await createPost({
        storageId,
        caption: caption.trim() || undefined,
      });

      setSelectedImage(null);
      setCaption("");
      router.push("/(tabs)");
    } catch (e) {
      console.error(e);
      Alert.alert("Помилка при публікації");
    } finally {
      setIsSharing(false);
    }
  };

  if (!selectedImage) {
    return (
      <View style={createStyles.container}>
        <View style={createStyles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={26} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={createStyles.headerTitle}>New Post</Text>
          <View style={{ width: 26 }} />
        </View>

        <TouchableOpacity
          style={createStyles.emptyImageContainer}
          onPress={pickImage}
        >
          <MaterialIcons name="add-photo-alternate" size={52} color={COLORS.textMuted} />
          <Text style={createStyles.emptyImageText}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={createStyles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 30}
    >
      <View style={createStyles.contentContainer}>
        <View style={createStyles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(null);
              setCaption("");
            }}
            disabled={isSharing}
          >
            <MaterialIcons
              name="close"
              size={26}
              color={isSharing ? COLORS.grey : COLORS.text}
            />
          </TouchableOpacity>

          <Text style={createStyles.headerTitle}>New Post</Text>

          <TouchableOpacity
            style={[
              createStyles.shareButton,
              isSharing && createStyles.shareButtonDisabled,
            ]}
            disabled={isSharing || !selectedImage}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={createStyles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={createStyles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[createStyles.content, isSharing && createStyles.contentDisabled]}>
            <View style={createStyles.imageSection}>
              <Image source={selectedImage} style={createStyles.previewImage} contentFit="cover" />

              <TouchableOpacity
                style={createStyles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <MaterialIcons name="photo-library" size={20} color="#ffffff" />
                <Text style={createStyles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={createStyles.inputSection}>
              <View style={createStyles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={createStyles.userAvatar}
                  contentFit="cover"
                />
                <TextInput
                  style={createStyles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
