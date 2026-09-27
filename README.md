# TinyPush

A tiny Web Push service for iPhone and iPad.

Send a POST request, get a notification on your phone.

TinyPush runs on Cloudflare Workers and stores one push subscription in KV.

It only supports iPhone and iPad.

## Setup

Install dependencies and log in to Cloudflare:

```bash
npm install
npx wrangler login
```

Create a KV namespace:

```bash
npx wrangler kv namespace create PUSH
```

Put the returned ID in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PUSH"
id = "YOUR_KV_ID"
```

Generate the token and VAPID keys:

```bash
npm run secrets
```

Then add them to the Worker:

```bash
npx wrangler secret put TOKEN
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

Deploy:

```bash
npm run deploy
```

## Connect your iPhone or iPad

Open the deployed URL in Safari.

Add it to the Home Screen, open it from there, enter your token, then tap **Enable notifications**.

That is all you need to do on the phone.

## Send a notification

```bash
curl https://YOUR-WORKER.workers.dev/api/send \
  -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"This is a test"}'
```

Windows CMD:

```cmd
curl https://YOUR-WORKER.workers.dev/api/send -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"Hello\",\"body\":\"This is a test\"}"
```

## Notes

TinyPush keeps only one subscription.

If you connect another device, the old subscription is replaced.

There are no accounts, device lists, dashboards, or notification history.

## License

MIT