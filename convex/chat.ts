import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all conversations for the current user
 */
export const getConversations = query({
  args: {},
  async handler(ctx) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
      .first();

    if (!currentUser) return [];

    // Get all conversations where user is a participant
    const conversations = await ctx.db
      .query("conversations")
      .collect();

    const userConversations = conversations.filter((conv) =>
      conv.participantIds.includes(currentUser._id)
    );

    // Enrich with other participant data
    const enriched = await Promise.all(
      userConversations.map(async (conv) => {
        const otherUserId = conv.participantIds.find(
          (id) => id !== currentUser._id
        );
        const otherUser = otherUserId ? await ctx.db.get(otherUserId) : null;

        return {
          ...conv,
          otherUser,
        };
      })
    );

    // Sort by lastMessageAt descending
    return enriched.sort(
      (a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0)
    );
  },
});

/**
 * Get or create a conversation between two users
 */
export const getOrCreateConversation = mutation({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    // Check if conversation already exists
    const existing = await ctx.db
      .query("conversations")
      .collect();

    const conversation = existing.find((conv) => {
      const hasCurrentUser = conv.participantIds.includes(currentUser._id);
      const hasOtherUser = conv.participantIds.includes(args.userId);
      return hasCurrentUser && hasOtherUser;
    });

    if (conversation) {
      return conversation._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      participantIds: [currentUser._id, args.userId],
      lastMessage: undefined,
      lastMessageAt: undefined,
    });

    return conversationId;
  },
});

/**
 * Send a message in a conversation
 */
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    if (!conversation.participantIds.includes(currentUser._id)) {
      throw new Error("User not in conversation");
    }

    const now = Date.now();

    // Insert message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: currentUser._id,
      content: args.content,
      createdAt: now,
    });

    // Update conversation's last message info
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content,
      lastMessageAt: now,
    });

    return { messageId, createdAt: now };
  },
});

/**
 * Get all messages in a conversation
 */
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  async handler(ctx, args) {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();

    // Enrich with sender data
    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          sender,
        };
      })
    );

    return enriched;
  },
});

/**
 * Delete a message
 */
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  async handler(ctx, args) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    if (message.senderId !== currentUser._id) {
      throw new Error("Can only delete own messages");
    }

    await ctx.db.delete(args.messageId);

    return { success: true };
  },
});
