# TinyPush

Send notifications to your **iPhone or iPad** with a simple HTTP request.

> **TinyPush is for iPhone and iPad only.**
>
> Android and desktop browsers are not supported.

TinyPush runs on Cloudflare Workers.

```text id="2b1g7x"
app / script / service
        ↓
    TinyPush
        ↓
  iPhone / iPad 🔔
```

No account system.  
No dashboard.  
No notification history.  
No dedicated server.

TinyPush stores one device subscription. If you connect another iPhone or iPad, it replaces the old one.

## Requirements

- Cloudflare account
- Node.js
- iPhone or iPad
- Safari

On iPhone and iPad, TinyPush must be added to the Home Screen before notifications can be enabled.

## Setup

Install dependencies:

```bash id="4a9ief"
npm install
npx wrangler login
```

Create a KV store:

```bash id="82zxws"
npx wrangler kv namespace create PUSH
```

Put the returned ID into `wrangler.toml`:

```toml id="61pxcc"
[[kv_namespaces]]
binding = "PUSH"
id = "YOUR_KV_ID"
```

Generate the token and VAPID keys:

```bash id="i4ib3z"
npm run secrets
```

You will get:

```text id="a8bcgj"
TOKEN=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

Save them as Worker secrets:

```bash id="wsnpe5"
npx wrangler secret put TOKEN
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

Deploy:

```bash id="3mk5kg"
npm run deploy
```

## Connect your iPhone or iPad

1. Open your TinyPush URL in Safari.
2. Add it to the Home Screen.
3. Open TinyPush from the Home Screen.
4. Enter your `TOKEN`.
5. Tap **Enable notifications**.

Your device can now receive notifications.

## Send a notification

```bash id="tn19j6"
curl https://YOUR-WORKER.workers.dev/api/send \
  -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"This is a test notification"}'
```

Windows CMD:

```cmd id="t8l499"
curl https://YOUR-WORKER.workers.dev/api/send -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"Hello\",\"body\":\"This is a test notification\"}"
```

Your iPhone or iPad should receive:

```text id="8zybfu"
🔔 Hello

This is a test notification
```

## API

Send a notification:

```text id="7yz096"
POST /api/send
```

Subscribe a device:

```text id="opvpgb"
POST /api/subscribe
```

Get the public VAPID key:

```text id="afx65k"
GET /api/vapid
```

## How it works

```text id="en70et"
iPhone / iPad subscribes
        ↓
subscription saved in Cloudflare KV
        ↓
POST /api/send
        ↓
Web Push
        ↓
iPhone / iPad receives notification
```

That is basically the whole project.

## License

MIT