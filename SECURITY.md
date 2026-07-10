# Security Guide for CatnoCathy

⚠️ **WARNING:** This project exposes a real shell. Before deploying to production or sharing publicly, implement proper security measures.

## Critical Security Considerations

### 1. Authentication is NOT Included by Default

Anyone who knows your URL can access the terminal. You MUST add authentication.

#### Option A: Basic HTTP Authentication (Easiest)

Create `auth-middleware.js`:

```javascript
const basicAuth = require('express-basic-auth');

const users = {
  'admin': 'change-this-password-123'
};

module.exports = basicAuth({
  users,
  challenge: true,
  realm: 'CatnoCathy Web Terminal'
});
```

Update `server.js`:

```javascript
const authMiddleware = require('./auth-middleware');
app.use(authMiddleware);
```

Install dependency:
```bash
npm install express-basic-auth
```

#### Option B: Environment Variable Token (Recommended for Cloud)

Create `token-auth.js`:

```javascript
const TOKEN = process.env.TERMINAL_TOKEN || 'default-insecure-token';

module.exports = (req, res, next) => {
  const token = req.query.token || req.headers.authorization?.split(' ')[1];
  
  if (token !== TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};
```

Update `server.js`:

```javascript
const tokenAuth = require('./token-auth');
app.use(tokenAuth);
```

Set environment variable:
```bash
export TERMINAL_TOKEN=your-secure-random-token-here
```

#### Option C: GitHub OAuth (Most Secure)

```javascript
const passport = require('passport');
const GitHubStrategy = require('passport-github2');

passport.use(
  new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  })
);

// In server.js:
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/github', passport.authenticate('github'));
app.get('/callback', passport.authenticate('github', { 
  failureRedirect: '/' 
}), (req, res) => res.redirect('/'));
```

---

### 2. Network Security

#### Use HTTPS Only
- All cloud platforms (Render, Railway) provide free HTTPS
- For self-hosted, use Let's Encrypt via certbot or Nginx
- Always redirect HTTP → HTTPS

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

#### Limit Access by IP
For private use, restrict to specific IPs:

```nginx
location / {
    allow 203.0.113.50;  # Your IP
    deny all;
}
```

---

### 3. Container/Process Security

#### Run as Non-Root User

In Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app

RUN addgroup -g 1000 catnocathy && \
    adduser -D -u 1000 -G catnocathy catnocathy

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN chown -R catnocathy:catnocathy /app

USER catnocathy
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Resource Limits

Docker:
```bash
docker run -m 512m --cpus="0.5" -d catnocathy
```

Kubernetes:
```yaml
resources:
  limits:
    memory: "512Mi"
    cpu: "500m"
  requests:
    memory: "256Mi"
    cpu: "250m"
```

#### Restrict Shell Capabilities

Use restricted shells or containers:

```javascript
const { spawn } = require('child_process');
const shell = spawn('sh', [], {
  stdio: ['pipe', 'pipe', 'pipe'],
  // Disable potentially dangerous features
});
```

---

### 4. Session & Data Protection

#### Implement Session Timeout

```javascript
const inactivityTimeout = 30 * 60 * 1000; // 30 minutes

wss.on('connection', (ws) => {
  let timeout;
  
  const resetTimeout = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      ws.close(1000, 'Inactivity timeout');
    }, inactivityTimeout);
  };
  
  resetTimeout();
  
  ws.on('message', resetTimeout);
  ws.on('close', () => clearTimeout(timeout));
});
```

#### Log Access

```javascript
const fs = require('fs');
const accessLog = fs.createWriteStream('access.log', { flags: 'a' });

app.use((req, res, next) => {
  accessLog.write(
    `${new Date().toISOString()} - ${req.ip} - ${req.method} ${req.url}\n`
  );
  next();
});
```

---

### 5. Input/Output Sanitization

#### Validate Input

```javascript
ws.on('message', (msg) => {
  try {
    const m = JSON.parse(msg);
    
    // Validate message structure
    if (!m.type || !['input', 'resize'].includes(m.type)) {
      return;
    }
    
    // Limit input size
    if (m.data && m.data.length > 10000) {
      ws.send(JSON.stringify({ error: 'Input too large' }));
      return;
    }
    
    // Process message...
  } catch (err) {
    // Silently ignore malformed messages
  }
});
```

---

### 6. Deployment Security Checklist

- [ ] Authentication implemented (Basic Auth, Token, or OAuth)
- [ ] HTTPS enabled
- [ ] Non-root user for container
- [ ] Resource limits configured
- [ ] Access logs enabled
- [ ] Session timeouts implemented
- [ ] Environment variables for secrets (never in code)
- [ ] Firewall rules configured
- [ ] Regular security updates applied
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Emergency kill switch for service

---

### 7. Platform-Specific Security

#### Render
- Set `NODE_ENV=production`
- Use environment variables for secrets
- Enable auto-deploys only for trusted branches
- Monitor analytics dashboard

#### Railway
- Use Railway's built-in secrets
- Enable Protect environment for production
- Set up spending limits

#### Self-Hosted Docker
- Scan images for vulnerabilities: `docker scan catnocathy`
- Use `docker-slim` to reduce attack surface
- Enable AppArmor/SELinux profiles
- Regular OS updates: `sudo apt update && sudo apt upgrade`

---

### 8. Monitoring & Alerts

Set up monitoring to detect unusual activity:

```javascript
const activeConnections = new Set();

wss.on('connection', (ws) => {
  activeConnections.add(ws);
  
  if (activeConnections.size > 10) {
    console.warn('⚠️ High connection count:', activeConnections.size);
  }
  
  ws.on('close', () => activeConnections.delete(ws));
});

// Monitor in a dashboard or log aggregation service
setInterval(() => {
  console.log(`Active connections: ${activeConnections.size}`);
}, 60000);
```

---

### 9. Incident Response Plan

If compromised:

1. **Immediately:**
   - Stop the service
   - Revoke all tokens/credentials
   - Reset environment variables

2. **Within 1 hour:**
   - Review access logs
   - Check what commands were executed
   - Identify source of compromise

3. **Within 24 hours:**
   - Redeploy with patches
   - Rotate all credentials
   - Update security measures
   - Notify users if needed

---

### 10. Recommended Additions

Consider implementing:

- [ ] Rate limiting (prevent brute-force attacks)
- [ ] CAPTCHA (prevent bot access)
- [ ] 2FA/MFA support
- [ ] Command history auditing
- [ ] IP whitelist functionality
- [ ] Session recording (for compliance)
- [ ] Intrusion detection
- [ ] DDoS protection (Cloudflare, etc.)

---

## Quick Security Checklist for First Deployment

```bash
# Before going live:

# 1. Add authentication
# [ ] Edit server.js to include auth middleware

# 2. Set secure environment variables
# [ ] TERMINAL_TOKEN=generate-random-string
# [ ] NODE_ENV=production

# 3. Enable HTTPS
# [ ] Use cloud platform HTTPS
# [ ] Or setup Let's Encrypt for self-hosted

# 4. Test access restrictions
# [ ] Try accessing without auth token → should fail
# [ ] Try accessing with wrong token → should fail
# [ ] Try accessing with correct token → should work

# 5. Configure logs
# [ ] Verify access logs are being written
# [ ] Set up log rotation

# 6. Review deployment
# [ ] Verify running as non-root user
# [ ] Check resource limits are set
# [ ] Confirm HTTPS redirect works
```

---

## Need Help?

- Render Security: https://render.com/security
- Railway Security: https://docs.railway.app/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/

---

**Remember:** Security is ongoing. Regularly update dependencies, review access logs, and apply patches promptly.
