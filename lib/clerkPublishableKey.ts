
export function isValidClerkPublishableKey(raw: string | undefined): boolean {
  const key = (raw ?? "").trim();
  if (!key) return false;
  if (key.includes("...")) return false;
  return /^pk_(test|live)_[A-Za-z0-9_-]+$/.test(key) && key.length >= 28;
}
