import { useAuth } from "@clerk/clerk-expo";
import type { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/theme";

export function InitialLayout({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
