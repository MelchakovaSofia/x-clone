import { useAuth, useSSO } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import {
  Pressable,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { authStyles } from "../../styles/auth.styles";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { startSSOFlow } = useSSO();
  const [error, setError] = useState<string | null>(null);

  const onGoogle = useCallback(async () => {
    setError(null);
    try {
      const redirectUrl = Linking.createURL("/", { scheme: "x-clone" });
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sign-in failed";
      setError(message);
    }
  }, [startSSOFlow]);

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <View style={authStyles.container}>
      <View style={authStyles.logoWrap}>
        <MaterialIcons name="tag" size={56} color={COLORS.primary} />
        <Text style={authStyles.title}>X Clone</Text>
        <Text style={authStyles.subtitle}>
          Увійдіть, щоб переглядати стрічку та публікації
        </Text>
      </View>

      <Pressable style={authStyles.button} onPress={onGoogle}>
        <MaterialIcons name="login" size={22} color={COLORS.onPrimary} />
        <Text style={authStyles.buttonText}>Continue with Google</Text>
      </Pressable>

      {error ? <Text style={authStyles.error}>{error}</Text> : null}
    </View>
  );
}
