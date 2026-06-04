import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

/**
 * After Google OAuth, Clerk redirects the whole tab here (web) with handshake params.
 * AuthenticateWithRedirectCallback completes the session without a popup/postMessage.
 * If a popup flow is ever used (window.opener set), finish it for the opener.
 */
if (
  Platform.OS === "web" &&
  typeof window !== "undefined" &&
  window.opener
) {
  WebBrowser.maybeCompleteAuthSession();
}

export default function SsoCallbackScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        gap: 12,
        padding: 24,
      }}
    >
      {Platform.OS === "web" ? (
        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
        />
      ) : null}
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={{ color: COLORS.textMuted, textAlign: "center" }}>
        Завершення входу…
      </Text>
    </View>
  );
}
