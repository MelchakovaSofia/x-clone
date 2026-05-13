import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { InitialLayout } from "../components/InitialLayout";
import { MissingClerkKeyScreen } from "../components/MissingClerkKeyScreen";
import { COLORS } from "../constants/theme";
import { isValidClerkPublishableKey } from "../lib/clerkPublishableKey";
import ClerkAndConvexProvider from "../providers/ClerkAndConvexProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

const publishableKey = (process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "").trim();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  let fontMap: Record<string, number> = {};
  try {
    fontMap = {
      SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
      JetBrainsMono: require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    };
  } catch {
    fontMap = {};
  }

  const [fontsLoaded] = useFonts(fontMap);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (!isValidClerkPublishableKey(publishableKey)) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: COLORS.background }}
          edges={["top", "bottom"]}
        >
          <StatusBar style="dark" />
          <MissingClerkKeyScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <ClerkAndConvexProvider publishableKey={publishableKey}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: COLORS.background }}
          edges={["top", "bottom"]}
        >
          <StatusBar style="dark" />
          <InitialLayout>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
              }}
            />
          </InitialLayout>
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
