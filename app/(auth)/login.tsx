import { useAuth, useSSO, useSignIn } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as AuthSession from "expo-auth-session";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { authStyles } from "../../styles/auth.styles";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const [error, setError] = useState<string | null>(null);

  const onGoogle = useCallback(async () => {
    setError(null);
    try {
      const redirectUrl =
        Platform.OS === "web" && typeof window !== "undefined"
          ? `${window.location.origin.replace(/\/$/, "")}/sso-callback`
          : AuthSession.makeRedirectUri({
              scheme: "x-clone",
              path: "sso-callback",
            });

      // Web: full-page redirect avoids broken popup/postMessage flows in many browsers.
      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (!signInLoaded || !signIn) {
          return;
        }
        await signIn.create({
          strategy: "oauth_google",
          redirectUrl,
        });
        const oauthUrl =
          signIn.firstFactorVerification.externalVerificationRedirectURL;
        if (!oauthUrl) {
          setError(
            "Не вдалося розпочати вхід Google. Перевірте redirect URL у Clerk:\n" +
              redirectUrl,
          );
          return;
        }
        window.location.assign(oauthUrl.toString());
        return;
      }

      const { createdSessionId, setActive, authSessionResult } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl,
        });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return;
      }
      if (authSessionResult?.type === "cancel" || authSessionResult?.type === "dismiss") {
        return;
      }
      setError(
        "Не вдалося завершити вхід. Перевірте в Clerk Dashboard, що для Google OAuth додано саме цей redirect URL:\n" +
          redirectUrl,
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sign-in failed";
      setError(message);
    }
  }, [signIn, signInLoaded, startSSOFlow]);

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
