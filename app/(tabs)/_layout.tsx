import { useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, Tabs } from "expo-router";
import { COLORS } from "../../constants/theme";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.surfaceLight,
          position: "absolute",
          elevation: 0,
          height: 40,
        },
        tabBarLabelStyle: { fontSize: 10, marginBottom: 0 },
        tabBarItemStyle: { paddingVertical: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bookmark-border" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications-none" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
