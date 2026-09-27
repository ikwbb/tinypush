import { sendPushNotification } from "@mmmike/web-push/send";

const json = (data, status = 200) =>
  Response.json(data, { status });

function authorized(request, env) {
  return request.headers.get("Authorization") === `Bearer ${env.TOKEN}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/vapid" && request.method === "GET") {
      return json({ publicKey: env.VAPID_PUBLIC_KEY });
    }

    if (url.pathname === "/api/subscribe" && request.method === "POST") {
      if (!authorized(request, env)) {
        return json({ error: "Unauthorized" }, 401);
      }

      const subscription = await request.json();
      await env.PUSH.put("subscription", JSON.stringify(subscription));

      return json({ ok: true });
    }

    if (url.pathname === "/api/send" && request.method === "POST") {
      if (!authorized(request, env)) {
        return json({ error: "Unauthorized" }, 401);
      }

      const stored = await env.PUSH.get("subscription");
      if (!stored) {
        return json({ error: "No phone subscribed" }, 404);
      }

      const subscription = JSON.parse(stored);
      const body = await request.json();

      if (!body.title) {
        return json({ error: "title is required" }, 400);
      }

      const delivered = await sendPushNotification(
        subscription,
        {
          title: body.title,
          body: body.body || ""
        },
        {
          subject: url.origin,
          publicKey: env.VAPID_PUBLIC_KEY,
          privateKey: env.VAPID_PRIVATE_KEY
        }
      );

      if (!delivered) {
        await env.PUSH.delete("subscription");
        return json({ error: "Subscription expired" }, 410);
      }

      return json({ ok: true });
    }

    return json({ error: "Not found" }, 404);
  }
};
