import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl =
  process.env.EXPO_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud";

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

type Props = {
  children: ReactNode;
  publishableKey: string;
};

export default function ClerkAndConvexProvider({
  children,
  publishableKey,
}: Props) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      appearance={{
        elements: {
          clerkCaptcha: {
            display: "none",
          },
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}