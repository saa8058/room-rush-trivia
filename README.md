# Room Rush Trivia

Room Rush Trivia is a mobile-first multiplayer party trivia game. One host creates a room, friends join from their phones with a room code or invite link, everyone answers the same questions, and the leaderboard updates after every round.

## Deploying on Render

This repository is prepared for Render deployment with `render.yaml`.

Render should use:

- Build command: `node bootstrap.mjs`
- Start command: `node server.mjs`
- Health check path: `/healthz`
- Environment variable: `HOST=0.0.0.0`

The build step restores the app files from the packed deployment payload in `.deploy/packed/`.

## Local Run

```bash
node bootstrap.mjs
npm start
```

Then open the printed local URL in a browser.

## Safety Notes

This is a browser-based web app. It does not install native software on players' phones, does not request camera, microphone, location, payment, or file-system permissions, and does not include gambling or real-money mechanics.

The server includes:

- strict security headers
- blocked camera/microphone/location/payment browser permissions
- a static-file allowlist
- request body size limits
- temporary in-memory room storage
- automatic room pruning

## Limitations

- Rooms are stored in memory, so rooms reset if the Render service restarts or sleeps.
- This MVP is intended for friendly private play, not large public traffic.
- Sound files are optional and can be added later under `public/sounds/`.
