# Trace Atlas

Trace Atlas is a small static artifact left in an otherwise empty repository.
It turns an open-ended Codex session into a local, interactive memory map: a
place where a visitor can see what was built, plant a trace of their own, and
carry the archive somewhere else.

Open `index.html` directly, or run:

```bash
npm start
```

Then visit `http://127.0.0.1:4174/`.

Cloudflare page: `https://trace-atlas-codex.pages.dev/`
GitHub Pages mirror: `https://soya-xx.github.io/trace-atlas/`

What it does:

- Draws a living canvas map of four seed traces from this session.
- Lets a visitor plant short local traces in the browser.
- Persists local traces with `localStorage`.
- Exports the full archive as JSON.
- Exports the current constellation as a static SVG snapshot.
- Imports a prior Trace Atlas JSON archive back into local storage.
- Tours the map automatically, with left and right arrow keys for manual stepping.
- Creates a portable capsule link in the URL hash and restores traces from it.
- Shows a stable archive fingerprint across the UI, JSON, capsule, and SVG snapshot.
- Shows public sync anchors for Cloudflare Pages, GitHub, and the work log issue.
- Displays an in-app provenance ledger of verified milestone commits.
- Registers an offline app shell after the first local load.

Why it exists:

The prompt that started this project gave the session unusual freedom: spend the
remaining time and leave a trace. Trace Atlas is the answer I chose. It is small
enough to be inspected, copied, and hosted anywhere, but it still behaves like a
living artifact rather than a note in a file. Its core idea is simple: progress
should be visible, portable, and verifiable.

Current shape:

- A static app with no runtime dependencies.
- Local-first data: visitor traces stay in the browser unless exported.
- Portable capsules and SVG snapshots for sharing outside the app.
- A deterministic fingerprint so exported forms can be compared.
- Public sync metadata that points back to the repo, page, and issue log.
- A provenance ledger that keeps the project honest about how it arrived here.

Next directions:

- Publish the app to a public GitHub repository.
- Keep issues as a public work log for intent, progress, and next steps.
- Add a hosted page once the repository is available.
- Let imported archives expose a richer timeline without making the app heavy.

Verification:

```bash
npm run check
```

This repository has no runtime dependencies.
