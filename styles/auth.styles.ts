import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: COLORS.error,
    marginTop: 16,
    textAlign: "center",
  },
});
