# TinyPush

A deliberately tiny self-hosted Web Push service for Cloudflare Workers.

One phone. One subscription. One `/api/send` endpoint.

## What it does

```text
script / ESP32 / curl
        |
        | POST /api/send
        v
Cloudflare Worker
        |
        | Web Push
        v
      phone
```

There are no accounts, device lists, invites, notification history, dashboards, or databases. A new subscription simply replaces the old one.

## Requirements

- Cloudflare account
- Node.js
- Safari on iOS/iPadOS: install the site to the Home Screen before subscribing

## Setup

### 1. Install

```bash
npm install
npx wrangler login
```

### 2. Create KV

```bash
npx wrangler kv namespace create PUSH
```

Copy the returned namespace ID into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PUSH"
id = "YOUR_KV_ID"
```

### 3. Generate secrets

```bash
npm run secrets
```

You will get:

```text
TOKEN=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

Add each value to the Worker:

```bash
npx wrangler secret put TOKEN
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

### 4. Deploy

```bash
npm run deploy
```

Open the deployed URL on your phone. On iPhone/iPad, add it to the Home Screen, open the installed web app, enter `TOKEN`, then tap **Enable notifications**.

## Send a notification

### curl

```bash
curl https://YOUR-WORKER.workers.dev/api/send \
  -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"ESP32","body":"Hello from ESP32"}'
```

### Windows CMD one-liner

```cmd
curl https://YOUR-WORKER.workers.dev/api/send -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"ESP32\",\"body\":\"Hello from ESP32\"}"
```

## API

### `GET /api/vapid`

Returns the public VAPID key.

### `POST /api/subscribe`

Stores one PushSubscription in KV. Requires the bearer token.

### `POST /api/send`

Sends a notification to the stored subscription. Requires the bearer token.

```json
{
  "title": "Hello",
  "body": "World"
}
```

## Design

The KV store contains exactly one useful record:

```text
subscription -> PushSubscription JSON
```

That is intentional. TinyPush is meant to stay tiny.

## License

MIT
