/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE is partially hand-maintained (see `publicApi` below).
 * After `npx convex dev`, if `api` loses modules in the IDE, keep `publicApi` as-is.
 *
 * HTTP router (`convex/http.ts`) must not be listed here — it breaks `FilterApi` inference.
 *
 * @module
 */

import type * as bookmarks from "../bookmarks.js";
import type * as comments from "../comments.js";
import type * as likes from "../likes.js";
import type * as notifications from "../notifications.js";
import type * as posts from "../posts.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

type AllModules = {
  bookmarks: typeof bookmarks;
  comments: typeof comments;
  likes: typeof likes;
  notifications: typeof notifications;
  posts: typeof posts;
  users: typeof users;
};

type FullTree = ApiFromModules<AllModules>;

type PublicFiltered = FilterApi<
  FullTree,
  FunctionReference<any, "public">
>;

/** Same tree but without `users` — avoids some TS language-service collapses on `typeof fullApi`. */
type NonUserModules = {
  bookmarks: typeof bookmarks;
  comments: typeof comments;
  likes: typeof likes;
  notifications: typeof notifications;
  posts: typeof posts;
};

type ExtraPublic = FilterApi<
  ApiFromModules<NonUserModules>,
  FunctionReference<any, "public">
>;

/**
 * Merge: keep `users` from the full filter, (re)attach other modules from a separate inference path.
 */
type publicApi = Omit<PublicFiltered, keyof ExtraPublic> & ExtraPublic;

/**
 * A utility for referencing Convex functions in your app's public API.
 */
export declare const api: publicApi;

export declare const internal: FilterApi<
  FullTree,
  FunctionReference<any, "internal">
>;

export declare const components: {};
