# Game 2048

A web-based (current) version of the classic 2048 puzzle game, built with modern web technologies.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Motion (Framer Motion)](https://motion.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/) (using a Monorepo workspace setup)

## Prerequisites

- Node.js (recommended: >= 20.x)
- Corepack (optional)
- pnpm (see `package.json` for the required version)

## Installation

1. Clone the repository to your local machine.
2. Install the dependencies at the root of the project:

```bash
pnpm install
```

## Running the Project (Development)

To start the local development server, run the following command at the root directory:

```bash
pnpm dev
```

Then, open your browser and navigate to `http://localhost:5173` (or the port displayed in your terminal) to play the game.

## Building the Project (Production)

To build the application for production:

```bash
pnpm build
```

The build output will be generated in the `game-2048/dist/` directory.

## Environment Variables

This project supports configuring the Base Path via environment variables, which is useful when deploying to sub-paths (e.g., GitHub Pages).

You can create a `.env` file in the `game-2048/` directory and add the following configuration:

```env
VITE_BASE_URL=/sub-path/
```

If not configured, the default value for the Base Path will be `/`.
