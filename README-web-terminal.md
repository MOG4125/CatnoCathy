# Web Terminal for CatnoCathy

This adds a small web-hosted terminal tool to the repository. It uses xterm.js in the browser and node-pty on the server to spawn a real shell and forward input/output over WebSockets.

WARNING: This project exposes a real shell. Do NOT run this on a publicly accessible server without adding proper authentication, authorization, and strict containerization. Use only on trusted networks or inside properly secured environments.

Quick start

1. Install dependencies:

   npm ci

2. Start the server:

   npm start

3. Open http://localhost:3000 in your browser.

Docker

Build and run with Docker:

   docker build -t catnocathy-terminal .
   docker run --rm -p 3000:3000 catnocathy-terminal

Security notes

- Add authentication (OAuth, basic auth, or similar) before exposing this to the internet.
- Consider running the shell in a restricted container or with a user that has minimal privileges.
- Disable for production unless you harden it.

Files added

- server.js — Express + ws + node-pty server
- public/index.html, public/app.js — frontend using xterm.js
- package.json — dependencies and start script
- Dockerfile — example container
- .gitignore — ignore node_modules

If you'd like, I can:
- Add authentication (simple username/password or GitHub OAuth)
- Create a systemd unit or Kubernetes manifest
- Add a GitHub Actions workflow that builds a Docker image

