import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "../constants/theme";

interface StoryProps {
  story: any;
  onPress?: () => void;
}

export function Story({ story, onPress }: StoryProps) {
  const ringColor = story.hasStory ? COLORS.primary : COLORS.surfaceLight;

  return (
    <Pressable onPress={onPress} style={{ alignItems: "center", width: 74 }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          borderWidth: 3,
          borderColor: ringColor,
          padding: 3,
          backgroundColor: COLORS.background,
        }}
      >
        <Image
          source={story.image}
          style={{ width: "100%", height: "100%", borderRadius: 999 }}
          contentFit="cover"
        />
      </View>
      <Text
        numberOfLines={1}
        style={{
          marginTop: 6,
          fontSize: 12,
          color: COLORS.textMuted,
        }}
      >
        {story.username}
      </Text>
    </Pressable>
  );
}

