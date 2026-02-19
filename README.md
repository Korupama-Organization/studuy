# Studuy — Frontend

A React application built with [Vite](https://vite.dev/).

---

## Prerequisites

Make sure the following tools are installed on your machine before getting started:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | >= 18.x (LTS recommended) | [nodejs.org](https://nodejs.org/) |
| **npm** | >= 9.x (comes with Node.js) | — |

Verify your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd studuy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (Vite default port).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the local development server with hot-reload |
| `npm run build` | Build the production bundle to the `dist/` folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

> **Type-check only (no emit):**
> ```bash
> npx tsc --noEmit
> ```

---

## Project Structure

```
studuy/
├── public/             # Static assets served as-is
├── src/
│   ├── assets/         # Images, fonts, and other assets
│   ├── vite-env.d.ts   # Vite client type declarations (SVG, CSS, etc.)
│   ├── App.tsx         # Root application component
│   ├── App.css         # Root component styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry point
├── tsconfig.json       # TypeScript root config (references app + node)
├── tsconfig.app.json   # TypeScript config for src/ (strict, react-jsx)
├── tsconfig.node.json  # TypeScript config for vite.config.ts
├── vite.config.ts      # Vite configuration
├── eslint.config.js    # ESLint configuration (TS + React)
└── package.json        # Project dependencies and scripts
```

---

## Tech Stack

- **[React 19](https://react.dev/)** — UI library
- **[Vite 7](https://vite.dev/)** — Build tool & dev server
- **[TypeScript 5](https://www.typescriptlang.org/)** — Static type checking (strict mode)
- **[ESLint 9](https://eslint.org/)** — Code linting with TypeScript + React Hooks rules

---

## TypeScript Configuration

The project uses **strict mode** with project references:

| Config file | Purpose |
|---|---|
| `tsconfig.json` | Root — references the two configs below |
| `tsconfig.app.json` | `src/` code — targets browser, `react-jsx` |
| `tsconfig.node.json` | `vite.config.ts` — targets Node/ESNext |

---

## Linting

This project uses ESLint with the following rule sets:

- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` — enforces Rules of Hooks
- `eslint-plugin-react-refresh` — validates Fast Refresh usage

Run the linter at any time with:

```bash
npm run lint
```

---

## Recommended Editor Setup

- **[VS Code](https://code.visualstudio.com/)** with the extensions:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## Troubleshooting

**`npm install` fails**
- Ensure you are using Node.js >= 18. Use [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage Node versions.

**Port already in use**
- Vite will automatically try the next available port. You can also set a custom port in `vite.config.ts`:
  ```ts
  server: { port: 3000 }
  ```

**TypeScript errors after pulling**
- Run `npx tsc --noEmit` to see all type errors before starting the dev server.

**Lint errors on save**
- Make sure the ESLint VS Code extension is installed and enabled for the workspace.
