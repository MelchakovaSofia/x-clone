# Meeting 2 — DB setup and CRUD (User & Post)

## Database

- **Backend:** Convex (serverless DB + API)
- **Schema:** `convex/schema.ts`
- **Apply schema:** `npx convex dev`

## Entity: User

| Operation | Convex function | Type |
|-----------|-----------------|------|
| Create | `users.createUser` | mutation (POST) |
| Get current | `users.getCurrentUser` | query (GET) |
| Get by id | `users.getUserProfile` | query (GET) |
| Update | `users.updateProfile` | mutation (PUT) |

## Entity: Post

| Operation | Convex function | Type |
|-----------|-----------------|------|
| Create | `posts.createPost` | mutation (POST) |
| Get feed | `posts.getFeedPosts` | query (GET) |
| Get by user | `posts.getUserPosts` | query (GET) |
| Delete | `posts.deletePost` | mutation (DELETE) |

## Testing

1. Run `npx convex dev`
2. Open [Convex Dashboard](https://dashboard.convex.dev) → project → **Functions**
3. Run `users:getCurrentUser` or `posts:getFeedPosts` and check JSON response
4. Or open **Data** tab to view `users` and `posts` tables
