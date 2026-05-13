import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/theme";
import { feedStyles } from "../styles/feed.styles";

export function Loader() {
  return (
    <View style={feedStyles.loaderWrap}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

