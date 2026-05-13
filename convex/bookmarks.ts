import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_both", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { bookmarked: false };
    }

    await ctx.db.insert("bookmarks", {
      userId: user._id,
      postId: args.postId,
    });
    return { bookmarked: true };
  },
});

export const getUserBookmarks = query({
  args: {},
  handler: async (ctx) => {
    try {
      const user = await getAuthenticatedUser(ctx);
      const bookmarks = await ctx.db
        .query("bookmarks")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .order("desc")
        .collect();

      const posts = await Promise.all(
        bookmarks.map(async (b) => {
          const post = await ctx.db.get(b.postId);
          if (!post) return null;
          const author = await ctx.db.get(post.userId);
          const like = await ctx.db
            .query("likes")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", user._id).eq("postId", post._id),
            )
            .first();
          return {
            ...post,
            author,
            isLiked: !!like,
            isBookmarked: true,
          };
        }),
      );

      return posts.filter((p) => p != null);
    } catch {
      return [];
    }

  },
});

export const getBookmarkedPosts = getUserBookmarks;
