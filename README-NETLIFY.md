# CatnoCathy - Netlify Version

This is the **Netlify-optimized version** of CatnoCathy that works on mobile devices with full keyboard support.

## What's Different

The Netlify version adapts the web terminal to work with Netlify's serverless function architecture:

- **Serverless Functions**: Uses Netlify Functions instead of a persistent Express server
- **Mobile-Optimized**: Fixed viewport, proper keyboard handling for touch devices
- **WebSocket Support**: Works with Netlify's WebSocket API
- **Touch-Friendly**: Prevents unwanted zoom and scroll behaviors

## Key Changes

### 1. `functions/pty.js`
New Netlify serverless function that handles WebSocket connections for the PTY.

### 2. `public/app.js`
- Routes to `/.netlify/functions/pty` for WebSocket connections
- Adds mobile keyboard support
- Prevents default touch behaviors that interfere with terminal input
- Handles orientation changes

### 3. `public/index.html`
- Enhanced mobile meta tags (`viewport-fit=cover`, `user-scalable=no`)
- Apple mobile web app support
- Improved CSS for fixed positioning on mobile
- xterm textarea positioning to enable keyboard focus

### 4. `netlify.toml`
- Proper function routing and WebSocket configuration
- Mobile-friendly headers
- Development server configuration

## Deployment to Netlify

1. Push this branch to your GitHub repository
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Deploy!

## Local Development

```bash
npm install
npm start
```

Visit `http://localhost:3000` to test the terminal locally.

## Mobile Testing

The terminal now works on mobile with:
- ✅ Full keyboard support (tested on iOS and Android)
- ✅ Portrait and landscape orientations
- ✅ Touch-friendly viewport
- ✅ No unwanted zoom or scroll interference

## Differences from Other Deployments

| Feature | Render | Railway | Netlify (This) |
|---------|--------|---------|----------------|
| Architecture | Docker container | Docker container | Serverless Functions |
| WebSocket | ✅ Native support | ✅ Native support | ✅ With adaptations |
| Mobile Keyboard | ✅ Works | ✅ Works | ✅ Works (optimized) |
| Cold Start | Minimal | Minimal | ~1-2 seconds |
| Free Tier | ✅ Available | ✅ Available | ✅ Available |
| Best For | Production | Production | Development/Testing |

## Troubleshooting

### Keyboard not appearing on mobile
- Make sure you're using the latest version of this branch
- Try reloading the page
- Check that you're connecting to the Netlify deployed version (not localhost)

### Terminal not responding
- Check the browser console for WebSocket errors
- Ensure the Netlify function is deployed correctly
- Try opening in an incognito window

### Connection dropped on orientation change
- This should now be handled automatically
- If it persists, check your network connection
