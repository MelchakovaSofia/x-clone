import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  avatarContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarFallback: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-start",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  nameContainer: {
    marginTop: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  bio: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  shareButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  gridContainer: {
    paddingBottom: 80,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
  },
  noPostsText: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  inputFocus: {
    borderColor: COLORS.primary,
  },
  charCounter: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
  },
  saveButtonDisabledText: {
    color: COLORS.textMuted,
  },
  postModalContent: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postModalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  postModalCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 22,
    zIndex: 10,
  },
});
