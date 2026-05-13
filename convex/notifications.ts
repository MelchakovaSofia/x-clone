import { query } from "./_generated/server";

export const getNotifications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .order("desc")
      .collect();

    return await Promise.all(
      notifications.map(async (n) => ({
        ...n,
        sender: await ctx.db.get(n.senderId),
        post: n.postId ? await ctx.db.get(n.postId) : null,
        comment: n.commentId ? await ctx.db.get(n.commentId) : null,
      })),
    );
  },
});
