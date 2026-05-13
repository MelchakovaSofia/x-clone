import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../constants/theme";

const { width } = Dimensions.get("window");

export const feedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },

  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    backgroundColor: COLORS.background,
  },
  storiesContent: {
    paddingHorizontal: 12,
    gap: 12,
  },

  postContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    paddingBottom: 12,
    marginBottom: 4,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  authorName: {
    color: COLORS.text,
    fontWeight: "700",
  },
  authorHandle: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  postImage: {
    width: "100%",
    height: width,
    backgroundColor: COLORS.surfaceLight,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 20,
  },
  postInfo: {
    paddingHorizontal: 14,
    paddingTop: 8,
    gap: 6,
  },
  likesText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  viewCommentsText: {
    color: COLORS.textMuted,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionCount: {
    color: COLORS.textMuted,
  },
  caption: {
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingTop: 6,
    fontSize: 14,
  },
  captionUsername: {
    fontWeight: "700",
  },

  loaderWrap: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
  commentItem: {
    marginBottom: 12,
  },
  commentText: {
    color: COLORS.text,
  },
  commentAuthor: {
    fontWeight: "700",
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  commentInput: {
    flex: 1,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});

