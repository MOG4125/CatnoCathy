# CatnoCathy - Web Terminal

A lightweight web-based terminal interface that runs in your browser. Access a shell directly through your web browser without needing to install anything locally.

## Quick Deploy Options

### Option 1: One-Click Deploy to Render (Easiest - No Self-Hosting Required) ✨

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/MOG4125/CatnoCathy)

Render handles everything automatically:
- Free tier available
- No configuration needed
- HTTPS included
- Auto-redeploy on push

**Steps:**
1. Click the button above
2. Authenticate with GitHub
3. Choose your region
4. Click "Deploy"
5. Wait ~2 minutes for your terminal to be live

### Option 2: Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/MOG4125/CatnoCathy)

Netlify makes deployment easy with serverless functions:
- Generous free tier
- Automatic builds on push
- HTTPS included
- CDN globally distributed

**Steps:**
1. Click the button above
2. Connect your GitHub account
3. Choose a site name
4. Click "Deploy Site"
5. Wait for build to complete (~2-3 minutes)

### Option 3: Deploy to Railway (Free Credits)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/Cq2Bjt)

Railway gives new users $5 free credits monthly:
- Simple deployment
- Auto-scaling
- Pay-as-you-go after free tier
- Automatic HTTPS

### Option 4: Deploy to Heroku (Classic)

Deploy directly to Heroku using the Heroku CLI:

```bash
heroku create your-app-name
git push heroku main
heroku open
```

Or click to deploy:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/MOG4125/CatnoCathy)

### Option 5: Self-Hosted (Docker)

For full control, run locally or on your own server:

```bash
# Clone and install
git clone https://github.com/MOG4125/CatnoCathy
cd CatnoCathy
npm install

# Run locally
npm start
# Open http://localhost:3000
```

Or with Docker:

```bash
docker build -t catnocathy .
docker run --rm -p 3000:3000 catnocathy
```

## Features

- 🌐 Lightweight web-based terminal
- ⚡ Real shell access via WebSockets
- 🎨 Full xterm.js support
- 📦 Easy one-click deployment
- 🔒 Works locally or in the cloud

## File Structure

```
├── server.js              # Express + WebSocket server
├── package.json           # Node dependencies
├── Dockerfile             # Docker configuration
├── render.yaml            # Render deployment config
├── netlify.toml           # Netlify deployment config
├── heroku.yml             # Heroku deployment config
├── railway.json           # Railway deployment config
└── public/
    ├── index.html         # Terminal UI
    └── app.js             # Terminal client code
```

## Security Notes

⚠️ **Important:** This project exposes shell access. Before using in production:

- Add authentication (see [authentication setup](./SECURITY.md))
- Use restricted containers with minimal privileges
- Deploy only on trusted networks
- Consider disabling for production unless properly hardened
- Use HTTPS only (all recommended platforms include this)

## Development

### Local Development

```bash
npm install
npm start
```

Visit http://localhost:3000

### Environment Variables

- `PORT` - Server port (default: 3000)
- `SHELL` - Shell to use (auto-detected: bash/zsh/powershell)
- `NODE_ENV` - Set to 'production' for deployment

## Supported Platforms

| Platform | Cost | Ease | Auto-Deploy | Notes |
|----------|------|------|-------------|-------|
| **Render** | Free tier | ⭐⭐⭐ | ✅ | Recommended - simplest |
| **Netlify** | Free tier | ⭐⭐⭐ | ✅ | Generous free tier, great for static + serverless |
| **Railway** | $5/month free | ⭐⭐ | ✅ | Good value |
| **Heroku** | Paid only | ⭐⭐ | ✅ | Classic platform |
| **Local/Docker** | Free | ⭐⭐ | N/A | Full control |

## License

MIT

## Support

For issues or questions:
1. Check the [Security Guide](./SECURITY.md)
2. Review [Deployment Guide](./DEPLOYMENT.md)
3. Open an issue on GitHub