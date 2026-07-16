# Resume Studio

A single-process Next.js application for editing professional and application details.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3009/profile](http://localhost:3009/profile).

The same Next.js process serves both the React UI and the profile API. Profile
data is held in server memory and resets to the demo profile when the process
restarts; no database or external service is required.

## Profile API

```text
GET   /api/profile  Read the current profile
PUT   /api/profile  Replace the complete profile
PATCH /api/profile  Update one or more profile fields
```

For example, update the headline from another terminal:

```bash
curl -X PATCH http://localhost:3009/api/profile \
  -H 'Content-Type: application/json' \
  -d '{"basic":{"headline":"Updated through the API"}}'
```

Click **Refresh from API** in the UI, or reload `/profile`, to display the API
change. Saving the editor sends the complete profile to `PUT /api/profile`.

## Interview feature brief

Implement improvements to the profile editor and its same-origin API without
adding a database. Users should be able to maintain their professional details
and common application answers in one focused workspace.

Useful checks before handoff:

```bash
npm run typecheck
npm run lint
npm run build
```
