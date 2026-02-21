
# DAYLOG_ — Voice AI Companion

A comic-style voice journal app with an animated stickman companion.

## Project Structure

```
src/
  App.jsx                 # Main layout + orchestration
  Stickman.jsx            # Animated SVG stickman     # React entry point
```

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Vercel auto-detects Vite — just click Deploy

## Connecting Your Real AI Backend

In `src/App.jsx`, find the `handleSend` function and replace the mock block:

```js
// ↓ Replace this block with your real API call
await new Promise(r => setTimeout(r, 1000 + Math.random() * 900))
const reply = AI_REPLIES[replyIdx.current % AI_REPLIES.length]
replyIdx.current++
// ↑ ---------------------------------------------------
```

With a fetch call:

```js
const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: text, history: messages }),
})
const reply = await res.json()
// reply should be: { text: string, pose: string, speech: string }
```

## Available Poses

Pass any of these as the `pose` field from your backend:

| Pose        | When to use                    |
|-------------|-------------------------------|
| idle        | Default standing               |
| talking     | AI is speaking                 |
| nodding     | Liste
