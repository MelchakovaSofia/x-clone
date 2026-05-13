import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export async function getAuthenticatedUser(ctx: { auth: any; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
    .first();
  if (!user) throw new Error("User not found");

  return user;
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return;
    }

    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});

export const updateProfile = mutation({
  args: {
    fullname: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await ctx.db.patch(user._id, {
      fullname: args.fullname,
      bio: args.bio,
    });
    return user._id;
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const isFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.userId),
      )
      .first();
    return !!follow;
  },
});

async function updateFollowCounts(ctx: any, userId: any, isFollow: boolean) {
  const user = await ctx.db.get(userId);
  if (user) {
    await ctx.db.patch(userId, {
      followers: Math.max(0, user.followers + (isFollow ? 1 : -1)),
    });
  }
}

export const toggleFollow = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.userId),
      )
      .first();

    if (existingFollow) {
      await ctx.db.delete(existingFollow._id);
      await updateFollowCounts(ctx, args.userId, false);
      await ctx.db.patch(currentUser._id, {
        following: Math.max(0, currentUser.following - 1),
      });
    } else {
      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId: args.userId,
      });
      await updateFollowCounts(ctx, args.userId, true);
      await ctx.db.patch(currentUser._id, {
        following: currentUser.following + 1,
      });

      await ctx.db.insert("notifications", {
        receiverId: args.userId,
        senderId: currentUser._id,
        type: "follow",
      });
    }

    return !existingFollow;
  },
});

export const getStoriesUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const now = Date.now();

    // Get all followers of current user
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", currentUser._id))
      .collect();

    const followerIds = follows.map((f) => f.followerId);

    // Add current user to list
    const userIds = [currentUser._id, ...followerIds];

    // Get active stories for each user
    const allStories = await ctx.db
      .query("stories")
      .collect();

    const activeStories = allStories.filter((s) => s.expiresAt > now);

    // Get users who have stories
    const usersWithStories = await Promise.all(
      userIds.map(async (userId) => {
        const hasStory = activeStories.some((s) => s.userId === userId);
        const user = await ctx.db.get(userId);
        return {
          ...user,
          hasStory,
        };
      })
    );

    // Filter to only users with stories
    return usersWithStories.filter((u) => u.hasStory);
  },
});
