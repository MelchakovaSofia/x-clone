import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const notificationsStyles = StyleSheet.create({
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
  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  itemContent: {
    flex: 1,
  },
  notificationText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  senderName: {
    fontWeight: "700",
    color: COLORS.text,
  },
  messageText: {
    color: COLORS.textMuted,
  },
  commentText: {
    color: COLORS.text,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  timeText: {
    color: COLORS.textMuted,
    marginTop: 4,
    fontSize: 12,
  },
  postPreview: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
});
