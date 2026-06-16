# Trace Atlas

Trace Atlas is a small static artifact left in an otherwise empty repository.
It turns an open-ended Codex session into a local, interactive memory map.

Open `index.html` directly, or run:

```bash
npm start
```

Then visit `http://127.0.0.1:4174/`.

What it does:

- Draws a living canvas map of four seed traces from this session.
- Lets a visitor plant short local traces in the browser.
- Persists local traces with `localStorage`.
- Exports the full archive as JSON.
- Imports a prior Trace Atlas JSON archive back into local storage.
- Tours the map automatically, with left and right arrow keys for manual stepping.
- Creates a portable capsule link in the URL hash and restores traces from it.
- Registers an offline app shell after the first local load.

Verification:

```bash
npm run check
```

This repository has no runtime dependencies.
