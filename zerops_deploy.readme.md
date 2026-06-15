# Deploying SpartanTournaments to Zerops

This project deploys to [Zerops](https://zerops.io) as an SSR Analog/Nitro app
backed by PostgreSQL, using the `zcli` command-line tool.

## Files

| File | Purpose |
|------|---------|
| `zerops_project.yaml` | **Project import** — defines the project and its services (`ssr` + `db`). Used once to create the infrastructure. |
| `zerops.yml` | **Build & deploy config** — read by `zcli push` on every deploy. Defines how the `ssr` service is built, which files are deployed, env vars, migrations, and the start command. |

> The `setup:` name in `zerops.yml` (`ssr`) **must match** the service `hostname`
> in `zerops_project.yaml`.

## Prerequisites

- `zcli` installed and up to date:
  ```bash
  npm install -g @zerops/zcli@latest
  ```
- A Zerops personal access token (GUI → *Settings → Access Token Management*).

## One-time setup

### 1. Log in
```bash
zcli login <your-access-token>
```

### 2. Create the project + services
```bash
zcli project project-import zerops_project.yaml
```
This provisions:
- `ssr` — `alpine/nodejs@22`, public subdomain enabled
- `db` — `postgresql:single@16`

Add `--org-id <id>` if your account belongs to multiple organizations.

### 3. Set the session secret
The app reads `SESSION_SECRET` (see `src/server/session.ts`), which has an
insecure dev fallback. Set a real value as a **secret env var** on the `ssr`
service in the GUI (*Service → Environment variables → Secret variables*) —
min. 32 characters. Do **not** commit it to `zerops.yml`.

## Deploying

From the repo root (so `zcli` finds `zerops.yml`):
```bash
zcli push ssr
```
Add `-P <project-id>` if you have access to multiple projects.

### What happens during a deploy
1. **Build** (`base: nodejs@22`):
   - `pnpm i`
   - `pnpm run build` (Vite/Analog → `dist/analog/server/index.mjs`)
2. **Deploy files**: `node_modules`, `dist`, `drizzle`, `drizzle.config.ts`, `package.json`
3. **Run** (`base: nodejs@22`):
   - `DATABASE_URL` is injected from the `db` service:
     `${db_connectionString}/${db_dbName}`
   - `initCommands`: `./node_modules/.bin/drizzle-kit migrate` runs pending
     migrations (it has DB access in the run phase)
   - `start`: `node dist/analog/server/index.mjs`, listening on port `3000`

## Database migrations

- Generate a new migration locally: `pnpm run db:generate`
- Migrations live in `drizzle/` and are applied automatically on every deploy
  via the `initCommands` step above.
- The migrator (`drizzle-kit`) is a devDependency; `pnpm i` (without `--prod`)
  keeps it in the deployed `node_modules`.

## Accessing the app

The `ssr` service has `enableSubdomainAccess: true`, so after the first deploy
Zerops assigns a `*.zerops.app` test URL (visible in the service detail). Attach
a custom domain from the GUI when ready.

## Troubleshooting

- **`DATABASE_URL` empty / DB connection fails** — the app logs
  `[DB] Initializing connection. URL present: ...` on startup
  (`src/server/db/index.ts`). Check the `ssr` runtime logs in the GUI.
- **Migrations didn't run** — confirm `drizzle/` and `drizzle.config.ts` are in
  `deployFiles` and check the init/runtime logs.
- **Wrong port** — Nitro listens on `PORT || 3000`; keep `ports.port` at `3000`
  in `zerops.yml`.
