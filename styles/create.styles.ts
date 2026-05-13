import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../constants/theme";

const { width } = Dimensions.get("window");

export const createStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentDisabled: {
    opacity: 0.7,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  emptyImageText: {
    color: COLORS.textMuted,
    fontSize: 16,
    textAlign: "center",
  },

  imageSection: {
    width,
    height: width,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  changeImageText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  inputSection: {
    padding: 16,
    flex: 1,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: COLORS.surfaceLight,
  },
  captionInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingTop: 8,
    minHeight: 40,
  },
});
