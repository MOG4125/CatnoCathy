# Deployment Guide for CatnoCathy

## Cloud Deployment (Recommended for Most Users)

### Render (Easiest - Recommended ⭐)

1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your CatnoCathy repository
5. Configure:
   - **Name:** `catnocathy` (or your preference)
   - **Runtime:** Node
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
6. Click **Create Web Service**
7. Wait 2-3 minutes for deployment
8. Access your terminal at the provided URL

**Benefits:**
- Free tier with generous limits
- Automatic HTTPS
- Auto-redeploy on git push
- Simple dashboard

---

### Railway

1. Go to https://railway.app
2. Click **Deploy** button (in README)
3. Authenticate with GitHub
4. Select repository
5. Railway automatically detects the Dockerfile
6. Your app deploys in ~1 minute

**Benefits:**
- $5/month free credits for new users
- Pay-as-you-go pricing after credits
- Excellent for hobby projects

---

### Heroku (Classic)

#### Using Heroku CLI:

```bash
# Install Heroku CLI if not already installed
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create catnocathy-unique-name

# Deploy
git push heroku main

# Open in browser
heroku open
```

#### Using Git Deploy:

```bash
# Add Heroku remote
heroku git:remote -a catnocathy-unique-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Note:** Heroku's free tier ended, but paid dynos are available.

---

## Self-Hosted Deployment

### Docker (Your Own VPS/Server)

#### Build and Run Locally:

```bash
docker build -t catnocathy:latest .
docker run -d --name catnocathy -p 3000:3000 catnocathy:latest
```

Visit `http://localhost:3000`

#### Deploy to a VPS (Ubuntu/Debian):

1. SSH into your server
2. Install Docker if needed:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

3. Clone repository:
   ```bash
   git clone https://github.com/MOG4125/CatnoCathy
   cd CatnoCathy
   ```

4. Build and run:
   ```bash
   sudo docker build -t catnocathy .
   sudo docker run -d --restart always -p 3000:3000 catnocathy
   ```

5. Setup reverse proxy (nginx):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
       }
   }
   ```

6. Get free HTTPS with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Node.js (Direct Install)

For direct Node.js deployment on a server:

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/MOG4125/CatnoCathy
cd CatnoCathy
npm ci

# Run with PM2 for process management
sudo npm install -g pm2
pm2 start server.js --name catnocathy
pm2 startup
pm2 save
```

---

## Environment Configuration

### Environment Variables

Set these when deploying:

```bash
# Port (defaults to 3000)
PORT=8080

# Node environment
NODE_ENV=production

# Shell to use (auto-detected if not set)
SHELL=/bin/bash
```

### On Render:
1. Go to your service dashboard
2. **Settings** → **Environment**
3. Add variables

### On Railway:
1. Go to your project
2. **Variables** tab
3. Add key-value pairs

### On Heroku:
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

---

## Monitoring & Logs

### Render:
- Dashboard shows logs in real-time
- Metrics tab for CPU/memory usage

### Railway:
- Logs tab in dashboard
- Real-time deployment logs

### Heroku:
```bash
heroku logs --tail
heroku logs --dyno=web
```

### Self-Hosted Docker:
```bash
docker logs catnocathy
docker logs -f catnocathy  # Follow logs
```

---

## Performance Tips

1. **Add authentication** before exposing to public
2. **Limit resource usage** - set container memory limits
3. **Use a reverse proxy** (nginx) in front of the service
4. **Enable HTTPS only** - redirect HTTP to HTTPS
5. **Monitor uptime** - use a status page service

---

## Troubleshooting

### "Command not found" error
- Ensure Node.js 14+ is installed
- Run `npm ci` to install dependencies

### Port already in use
- Change `PORT` environment variable
- Or kill existing process: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill`

### WebSocket connection fails
- Ensure your deployment platform supports WebSocket
- Check firewall/proxy settings
- Verify HTTPS is configured correctly

### High memory usage
- Consider limiting shell execution
- Add memory limits to Docker container

---

## Next Steps

After deployment:
1. **Add authentication** - See SECURITY.md
2. **Set up custom domain** - Available on all platforms
3. **Configure backups** - If needed for your use case
4. **Monitor usage** - Check platform dashboards

---

For more help, see [SECURITY.md](./SECURITY.md) for hardening guidance.
