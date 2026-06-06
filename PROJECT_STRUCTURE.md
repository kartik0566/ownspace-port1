# Project Structure

```text
.
+-- backend/
|   +-- config/
|   |   `-- database.js
|   +-- controllers/
|   |   +-- aboutController.js
|   |   +-- authController.js
|   |   +-- contactController.js
|   |   +-- educationController.js
|   |   +-- experienceController.js
|   |   +-- portfolioController.js
|   |   +-- projectController.js
|   |   `-- skillController.js
|   +-- middleware/
|   |   `-- auth.js
|   +-- models/
|   +-- routes/
|   +-- utils/
|   +-- seed.js
|   +-- server.js
|   `-- package.json
+-- frontend/
|   +-- src/
|   |   +-- admin/
|   |   +-- assets/
|   |   +-- components/
|   |   +-- utils/
|   |   +-- App.jsx
|   |   +-- App.css
|   |   +-- index.css
|   |   `-- main.jsx
|   +-- index.html
|   +-- package.json
|   +-- postcss.config.js
|   +-- tailwind.config.js
|   `-- vite.config.js
+-- .gitignore
+-- eslint.config.js
+-- package.json
`-- README.md
```

## Source Of Truth

- `frontend/src` is the only React application source.
- `backend/server.js` is the API entrypoint.
- Root `package.json` is only for workspace-level commands.
- Build outputs, dependency folders, database files, archives, and local env files should stay out of source control.
