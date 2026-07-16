# Resume Studio

A standalone Next.js profile editor with a client-side Resume Version Manager.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/profile](http://localhost:3000/profile).

The app intentionally has no database, backend, authentication, or external
service. The demo profile and up to ten named resume snapshots are persisted in
the browser's `localStorage`.

## Interview feature brief

Implement improvements to the Resume Version Manager without adding a
database. Users should be able to save named checkpoints, inspect changes,
restore a checkpoint into the editor, and explicitly save the restored profile.
Preserve the two-step restore behavior: restoring changes the editor only; it
must not silently overwrite the saved current profile.

Useful checks before handoff:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
