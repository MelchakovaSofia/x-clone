import { Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export function MissingClerkKeyScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 24,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        Потрібен ключ Clerk
      </Text>
      <Text style={{ color: COLORS.textMuted, marginTop: 14, lineHeight: 22 }}>
        У файлі .env має бути справжній Publishable key з Clerk (не заглушка на кшталт
        pk_test_... з прикладу).
      </Text>
      <Text
        style={{
          color: COLORS.primary,
          marginTop: 16,
          fontSize: 14,
        }}
      >
        Clerk Dashboard → Configure → API Keys → Publishable key
      </Text>
      <Text style={{ color: COLORS.textMuted, marginTop: 20, lineHeight: 20 }}>
        Приклад рядка в `.env` (без лапок і пробілів навколо значення):
      </Text>
      <Text
        selectable
        style={{
          color: COLORS.text,
          marginTop: 8,
          fontFamily: "monospace",
          fontSize: 12,
        }}
      >
        EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ваш_повний_ключ
      </Text>
      <Text style={{ color: COLORS.textMuted, marginTop: 20, fontSize: 13 }}>
        Збережіть `.env` і перезапустіть Metro (`Ctrl+C`, потім `npx expo start
        --clear`).
      </Text>
    </View>
  );
}
