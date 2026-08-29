# WordMind

WordMind is a personal, clean, and responsive vocabulary learning application designed to help you build and retain your word knowledge effortlessly. It runs entirely in your browser using local storage.

## Features

- **Flashcards:** A beautifully animated 3D flip card experience to test your memory.
- **Vocabulary Management:** Easily add, edit, delete, and search your personal vocabulary bank.
- **My Imagination:** Build strong mental associations by writing your own personal notes for each word.
- **Review System:** A built-in learning scheduler that prioritizes words you need to practice (Again, Hard, Good, Easy intervals).
- **Statistics Dashboard:** Track your learning progress, accuracy, and recent activity at a glance.
- **Local Storage:** All your data is safely persisted in your browser's local storage. No accounts or backend required.
- **Responsive Design:** Optimized for desktop, tablet, and mobile with seamless swipe gestures.

## Tech Stack

- React
- Vite
- JavaScript
- Vanilla CSS
- Browser `localStorage` API

## Development

To run WordMind locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Production Build

To create an optimized production build:

```bash
npm run build
```

## Desktop Application

WordMind can run as a native Windows desktop application using Tauri 2.

- Development (browser): `npm run dev` continues to run the normal Vite React app.
- Desktop development: `npm run tauri:dev` will run the app inside the Tauri shell (requires Tauri CLI and Rust toolchain).
- Desktop build: `npm run tauri:build` builds a Windows desktop artifact (requires Rust, Cargo, and Windows build tools).

Data storage: the app continues to use localStorage for vocabulary, imagination, review, and statistics. Data persists between launches of the desktop app on the same device.

See the project docs for details and system requirements.

## Note on Data Storage

WordMind is designed as a strict client-side application. It stores your vocabulary securely in the browser. It does not synchronize with the cloud, ensuring total privacy and instantaneous performance.
