import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const STORY_DURATION = 24 * 60 * 60 * 1000; 

export const createStory = mutation({
  args: {
    imageUrl: v.string(),
    storageId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const userId = (
      await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
        .first()
    )?._id;

    if (!userId) throw new Error("User not found");

    const now = Date.now();
    const expiresAt = now + STORY_DURATION;

    const storyId = await ctx.db.insert("stories", {
      userId,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      createdAt: now,
      expiresAt,
      views: 0,
    });

    return storyId;
  },
});


export const getActiveStories = query({
  args: {},
  async handler(ctx) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
      .first();

    if (!currentUser) return [];

    const now = Date.now();

    const allStories = await ctx.db
      .query("stories")
      .withIndex("by_expires_at", (q) => q.gte("expiresAt", now))
      .collect();

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", currentUser._id))
      .collect();

    const followerIds = follows.map((f) => f.followerId);

    const filteredStories = allStories.filter(
      (story) =>
        story.userId === currentUser._id || followerIds.includes(story.userId)
    );

    const enrichedStories = await Promise.all(
      filteredStories.map(async (story) => {
        const storyUser = await ctx.db.get(story.userId);
        return {
          ...story,
          user: storyUser,
        };
      })
    );

    return enrichedStories;
  },
});

export const getStoriesByUser = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const now = Date.now();

    const stories = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const activeStories = stories.filter((s) => s.expiresAt > now);

    return activeStories;
  },
});

export const incrementViews = mutation({
  args: {
    storyId: v.id("stories"),
  },
  async handler(ctx, args) {
    const story = await ctx.db.get(args.storyId);
    if (!story) throw new Error("Story not found");

    await ctx.db.patch(args.storyId, {
      views: story.views + 1,
    });

    return { views: story.views + 1 };
  },
});

export const deleteExpiredStories = mutation({
  args: {},
  async handler(ctx) {
    const now = Date.now();

    const expiredStories = await ctx.db
      .query("stories")
      .withIndex("by_expires_at", (q) => q.lt("expiresAt", now))
      .collect();

    for (const story of expiredStories) {
      await ctx.db.delete(story._id);
    }

    return { deleted: expiredStories.length };
  },
});
