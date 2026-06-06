# Kartik Portfolio

A full-stack portfolio app with a React/Vite frontend, an Express API, MongoDB data, and an admin dashboard for managing portfolio content.

## Project Layout

```text
.
+-- backend/              # Express API, MongoDB models, routes, seed script
+-- frontend/             # React/Vite app and assets
+-- eslint.config.js      # Shared lint config
+-- package.json          # Workspace scripts
+-- package-lock.json     # Root workspace lockfile
`-- PROJECT_STRUCTURE.md  # Folder reference
```

Generated folders such as `node_modules`, `dist`, and `.mongodb-data` are intentionally ignored.

## Setup

Install everything from the project root:

```bash
npm install
```

Create environment files from the examples in PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Update `backend/.env` with your MongoDB URI, JWT secret, admin user, and CORS origin.

## Run Locally

Start the full local app:

```bash
npm run dev
```

This starts MongoDB if needed, then the API, then the frontend.

If you prefer separate terminals, start MongoDB first:

```bash
npm run dev:db
```

Start the API:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`
- API health check: `http://localhost:5000/api/health`

Seed demo data after MongoDB is running:

```bash
npm run seed
```

## Useful Commands

```bash
npm run build          # Build frontend for production
npm run lint           # Lint frontend and backend source
npm run preview        # Preview the production frontend build
```
