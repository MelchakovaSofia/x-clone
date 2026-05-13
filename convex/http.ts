import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response("Missing CLERK_WEBHOOK_SECRET environment variable", {
        status: 500,
      });
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const body = await request.text();

    const wh = new Webhook(webhookSecret);
    let evt: { type: string; data: Record<string, unknown> };

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as { type: string; data: Record<string, unknown> };
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    if (evt.type === "user.created") {
      const data = evt.data as {
        id: string;
        email_addresses?: Array<{ email_address: string }>;
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string | null;
      };

      const email = data.email_addresses?.[0]?.email_address;
      if (!email) {
        return new Response("No email in payload", { status: 400 });
      }

      const name =
        `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
        email.split("@")[0] ||
        "User";

      const localPart = email.split("@")[0] || "user";

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name,
          image: data.image_url ?? "",
          clerkId: data.id,
          username: localPart,
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
