# Atwix Trivia

A mobile-first multiplayer trivia party game. One player creates a room, friends join with a code or invite link, and everyone races through the same questions on their phones.

## Play locally

```bash
node server.mjs
```

Open the local address shown in the terminal. For phones on the same Wi-Fi, open the laptop's local network address, for example:

```text
http://YOUR-LAPTOP-IP:3000
```

## Play with friends in different countries

The app needs a public web address. Local Wi-Fi links like `http://10.x.x.x:3017` only work in your home. For brothers in different countries, deploy it as a small Node web service and share the public HTTPS link.

### Render setup

1. Put this project in a GitHub repository.
2. In Render, choose **New Web Service**.
3. Connect the repository.
4. Use these settings:
   - Runtime: Node
   - Build command: `node scripts/build-browser-bundle.mjs && node scripts/validate-deck.mjs`
   - Start command: `node server.mjs`
   - Health check path: `/healthz`
5. Add this environment variable:
   - `HOST=0.0.0.0`
6. Deploy, then share the Render URL with players.

Optional environment variable:

```text
PUBLIC_BASE_URL=https://your-public-domain.example
```

Use `PUBLIC_BASE_URL` only if your hosting provider does not automatically pass the correct public host/protocol. Render provides `RENDER_EXTERNAL_URL`, and the app uses it automatically for copied invite links.

## Install on phones

Atwix Trivia is a Progressive Web App. After you deploy it:

- Android: open the public link in Chrome and tap **Install App** when prompted.
- iPhone: open the public link in Safari, tap **Share**, then **Add to Home Screen**.

Everyone still plays through the same public server. The installed app is just a home-screen shortcut with app-style display.

## Important limitations

Rooms are stored in memory. If the server restarts, active rooms disappear. For casual game nights this is fine, but a production version should move room state to Redis, Firebase, Supabase, or another shared realtime store.

The app does not use login, payments, gambling, betting, or real-money mechanics.

## Sound files

Audio is optional and starts muted until a player taps **Enable party sounds**. Volume is saved in that browser with `localStorage`; sound and music intentionally reset to off on each fresh page load.

The app looks for local audio files in `public/sounds/`:

```text
public/sounds/countdown.mp3
public/sounds/answer-lock.mp3
public/sounds/reveal.mp3
public/sounds/correct.mp3
public/sounds/wrong.mp3
public/sounds/leaderboard.mp3
public/sounds/winner.mp3
public/sounds/background-loop.mp3
```

If sound effect files are missing, the app uses short generated placeholder tones after sound is enabled. If background music is missing, it stays silent. Add royalty-free files with the exact names above and they will be used automatically.

## Question Bank

The local deck contains more than 1,000 trivia questions across the party categories, including more than 200 visual questions. Visual questions now use real image sources where possible:

- flags from FlagCDN
- logos from Simple Icons
- landmark, stadium, and animal photos through `/api/wiki-image`, which redirects to Wikipedia/Wikimedia images

If a real image cannot load, the app shows a clean unavailable state instead of a fake generated picture. You can still add your own permitted local image assets under `public/images/questions/`.
