import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ActivityIndicator, Dimensions, FlatList, Image, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 16 * 2 - 12 * 2) / 3;

function NoBookmarksFound() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Закладок немає</Text>
      <Text style={styles.emptySubtitle}>
        Збережіть пости, щоб бачити їх тут.
      </Text>
    </View>
  );
}

export default function BookmarksScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const bookmarks = useQuery(api.bookmarks.getUserBookmarks, undefined, {
    skip: !isSignedIn,
  });

  if (!isLoaded || bookmarks === undefined) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Bookmarks</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<NoBookmarksFound />}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    padding: 16,
  },
  loader: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
};
