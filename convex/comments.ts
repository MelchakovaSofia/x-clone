import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const commentId = await ctx.db.insert("comments", {
      userId: user._id,
      postId: args.postId,
      content: args.content,
    });

    await ctx.db.patch(args.postId, { comments: post.comments + 1 });

    if (post.userId !== user._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: user._id,
        type: "comment",
        postId: args.postId,
        commentId,
      });
    }

    return commentId;
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return await Promise.all(
      comments.map(async (c) => ({
        ...c,
        author: await ctx.db.get(c.userId),
      })),
    );
  },
});
