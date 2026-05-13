import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Image,
  Pressable,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface StoryViewerModalProps {
  visible: boolean;
  story: any;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");
const STORY_DURATION = 5000; // 5 seconds per story

export const StoryViewerModal = ({
  visible,
  story,
  onClose,
}: StoryViewerModalProps) => {
  const [progress] = useState(new Animated.Value(0));
  const incrementViews = useMutation(api.stories.incrementViews);

  useEffect(() => {
    if (!visible || !story) return;

    // Increment views when story opens
    incrementViews({ storyId: story._id }).catch(console.error);

    // Start progress animation
    Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });

    return () => {
      progress.setValue(0);
    };
  }, [visible, story]);

  if (!story) return null;

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={{ flex: 1, position: "relative" }}>
          {/* Progress Bar */}
          <View
            style={{
              height: 3,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: "#fff",
                width: progressWidth,
              }}
            />
          </View>

          {/* Story Image */}
          <Image
            source={{ uri: story.imageUrl }}
            style={{
              flex: 1,
              width,
              height: height - 100,
              resizeMode: "cover",
            }}
          />

          {/* User Info Overlay */}
          <View
            style={{
              position: "absolute",
              top: 60,
              left: 16,
              zIndex: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: story.user?.image }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 12,
              }}
            />
            <View>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                {story.user?.username}
              </Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}>
                {Math.floor((Date.now() - story.createdAt) / 60000)}m ago
              </Text>
            </View>
          </View>

          {/* Close Button */}
          <Pressable
            style={{
              position: "absolute",
              top: 60,
              right: 16,
              zIndex: 10,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>

          {/* Next/Prev Area */}
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 100,
              bottom: 0,
              flexDirection: "row",
            }}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={onClose}
            />
            <Pressable
              style={{ flex: 1 }}
              onPress={onClose}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
