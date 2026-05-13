import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export { toggleLike } from "./likes";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Failed to get image URL");

    const postId = await ctx.db.insert("posts", {
      userId: user._id,
      storageId: args.storageId,
      imageUrl,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    await ctx.db.patch(user._id, { posts: user.posts + 1 });

    return postId;
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (!user || post.userId !== user._id) throw new Error("Unauthorized");

    await ctx.storage.delete(post.storageId);

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const like of likes) await ctx.db.delete(like._id);

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const comment of comments) await ctx.db.delete(comment._id);

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const bookmark of bookmarks) await ctx.db.delete(bookmark._id);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const notification of notifications) await ctx.db.delete(notification._id);

    await ctx.db.delete(args.postId);
    await ctx.db.patch(user._id, { posts: Math.max(0, user.posts - 1) });
  },
});

export const getFeedPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    const posts = await ctx.db.query("posts").order("desc").collect();

    if (posts.length === 0) return [];

    const postsWithInfo = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);

        const like = currentUser
          ? await ctx.db
              .query("likes")
              .withIndex("by_user_and_post", (q) =>
                q.eq("userId", currentUser._id).eq("postId", post._id),
              )
              .first()
          : null;

        const bookmark = currentUser
          ? await ctx.db
              .query("bookmarks")
              .withIndex("by_both", (q) =>
                q.eq("userId", currentUser._id).eq("postId", post._id),
              )
              .first()
          : null;

        return {
          ...post,
          author,
          isLiked: !!like,
          isBookmarked: !!bookmark,
        };
      }),
    );

    return postsWithInfo;
  },
});

// Alias for homework v4 naming (Home feed)
export const getPosts = getFeedPosts;

export const getUserPosts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getPostsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const identity = await ctx.auth.getUserIdentity();
    const currentUser = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
          .first()
      : null;

    const postsWithInfo = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);

        const like = currentUser
          ? await ctx.db
              .query("likes")
              .withIndex("by_user_and_post", (q) =>
                q.eq("userId", currentUser._id).eq("postId", post._id),
              )
              .first()
          : null;

        const bookmark = currentUser
          ? await ctx.db
              .query("bookmarks")
              .withIndex("by_both", (q) =>
                q.eq("userId", currentUser._id).eq("postId", post._id),
              )
              .first()
          : null;

        return {
          ...post,
          author,
          isLiked: !!like,
          isBookmarked: !!bookmark,
        };
      }),
    );

    return postsWithInfo;
  },
});
