import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FlatList, Pressable, Text, View } from "react-native";
import { Loader } from "../../components/Loader";
import { Post } from "../../components/Post";
import { StoriesSection } from "../../components/StoriesSection";
import { feedStyles } from "../../styles/feed.styles";

export default function FeedScreen() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  const posts = useQuery(api.posts.getPosts, undefined, {
    skip: !isSignedIn,
  });
  const currentUser = useQuery(api.users.getCurrentUser, undefined, {
    skip: !isSignedIn,
  });

  if (!isLoaded || posts === undefined) {
    return <Loader />;
  }

  return (
    <View style={feedStyles.screen}>
      <View style={feedStyles.header}>
        <Text style={feedStyles.headerTitle}>X Clone</Text>
        <Pressable
          onPress={() => signOut()}
          hitSlop={12}
          style={feedStyles.logoutButton}
        >
          <Text style={feedStyles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={<StoriesSection />}
        ListEmptyComponent={
          <Text style={feedStyles.emptyText}>Постів ще немає. Будьте першим!</Text>
        }
        renderItem={({ item }) => (
          <Post
            post={item as any}
            currentUserId={currentUser?._id ?? null}
          />
        )}
      />
    </View>
  );
}
