import { FlatList, View, Pressable, Text, Alert } from "react-native";
import { feedStyles } from "../styles/feed.styles";
import { Story } from "./Story";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import * as ImagePicker from "expo-image-picker";
import { useConvexAuth } from "convex/react";
import { useState } from "react";

export function StoriesSection() {
  const { isLoading: isAuthLoading } = useConvexAuth();
  const storiesUsers = useQuery(api.users.getStoriesUsers);
  const createStory = useMutation(api.stories.createStory);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddStory = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const uri = result.assets[0].uri;

        // Get blob data from image
        const response = await fetch(uri);
        const blob = await response.blob();

        // Generate storage ID and upload to Convex storage
        // Note: This is a simplified version. In production, you'd need to:
        // 1. Upload to Convex storage
        // 2. Get the storage ID
        // 3. Pass it to createStory

        // For now, using a placeholder storage ID
        const storageId = "placeholder_storage_id" as any;
        
        await createStory({
          imageUrl: uri,
          storageId,
        });

        Alert.alert("Success", "Story created!");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create story");
    } finally {
      setIsUploading(false);
    }
  };

  if (isAuthLoading) {
    return null;
  }

  type AddStoryItem = { id: "add" };
  const data: (AddStoryItem | (NonNullable<typeof storiesUsers>[number]))[] =
    storiesUsers ? [{ id: "add" }, ...storiesUsers] : [];

  return (
    <View style={feedStyles.storiesContainer}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s, idx) =>
          "id" in s && s.id === "add" ? "add" : ("_id" in s ? s._id : String(idx))
        }
        contentContainerStyle={feedStyles.storiesContent}
        renderItem={({ item }) =>
          "id" in item && item.id === "add" ? (
            <Pressable
              style={feedStyles.addStoryButton}
              onPress={handleAddStory}
              disabled={isUploading}
            >
              <View
                style={[
                  feedStyles.storyCircle,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text style={{ fontSize: 32 }}>+</Text>
              </View>
              <Text style={feedStyles.storyUsername}>Add Story</Text>
            </Pressable>
          ) : (
            <Story story={item} />
          )
        }
      />
    </View>
  );
}

