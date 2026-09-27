# TinyPush

Send notifications to your phone with a simple HTTP request.

TinyPush runs on Cloudflare Workers.

```text
app / script / service
        ↓
    TinyPush
        ↓
     phone 🔔
```

No account system.  
No dashboard.  
No notification history.  
No dedicated server.

TinyPush stores one phone subscription. If you connect another phone, it replaces the old one.

## Setup

Install dependencies:

```bash
npm install
npx wrangler login
```

Create a KV store:

```bash
npx wrangler kv namespace create PUSH
```

Put the returned ID into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PUSH"
id = "YOUR_KV_ID"
```

Generate the token and VAPID keys:

```bash
npm run secrets
```

You will get:

```text
TOKEN=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

Save them as Worker secrets:

```bash
npx wrangler secret put TOKEN
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

Deploy:

```bash
npm run deploy
```

## Connect your phone

Open your TinyPush URL on your phone.

On iPhone or iPad:

1. Open it in Safari.
2. Add it to the Home Screen.
3. Open TinyPush from the Home Screen.
4. Enter your `TOKEN`.
5. Tap **Enable notifications**.

Your phone can now receive notifications.

## Send a notification

```bash
curl https://YOUR-WORKER.workers.dev/api/send \
  -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"This is a test notification"}'
```

Windows CMD:

```cmd
curl https://YOUR-WORKER.workers.dev/api/send -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"Hello\",\"body\":\"This is a test notification\"}"
```

Your phone should receive:

```text
🔔 Hello

This is a test notification
```

## API

Send a notification:

```text
POST /api/send
```

Subscribe a phone:

```text
POST /api/subscribe
```

Get the public VAPID key:

```text
GET /api/vapid
```

## How it works

```text
phone subscribes
      ↓
subscription saved in Cloudflare KV
      ↓
POST /api/send
      ↓
Web Push
      ↓
phone receives notification
```

That is basically the whole project.

## License

MIT