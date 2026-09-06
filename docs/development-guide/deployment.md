# Deployment Guide

This guide covers the complete deployment process for STI-FE application, from server setup to automated CI/CD deployment using GitHub Actions, PM2, and Nginx.

## Table of Contents

1. [Overview](#overview)
2. [Server Requirements](#server-requirements)
3. [Initial Server Setup](#initial-server-setup)
4. [PM2 Configuration](#pm2-configuration)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [GitHub Actions CI/CD](#github-actions-cicd)
8. [Deployment Workflow](#deployment-workflow)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Overview

The application is deployed in two environments:

| Environment | Domain | Port | PM2 Process | Branch | Directory |
|-------------|--------|------|-------------|---------|-----------|
| Production  | sti.dinus.id | 4000 | sti-fe | production | /var/www/sti-fe |
| Staging     | dev-sti.dinus.id | 4005 | sti-staging | staging | /var/www/sti-staging |

**Deployment Stack:**
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **SSL:** Let's Encrypt (Certbot)
- **Node Version:** 18.x

## Server Requirements

- Ubuntu 20.04 LTS or higher
- Node.js 18.x (managed via NVM)
- PM2 (Process Manager)
- Nginx (Reverse Proxy)
- Certbot (SSL Certificates)
- Minimum 2GB RAM
- Minimum 20GB Storage

## Initial Server Setup

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version
npm --version
```

### 3. Install PM2 Globally

```bash
npm install -g pm2

# Enable PM2 startup on boot
pm2 startup systemd
# Follow the command output and run the suggested command

# Save PM2 process list
pm2 save
```

### 4. Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 5. Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

### 6. Create Application Directories

```bash
# Create directories for both environments
sudo mkdir -p /var/www/sti-fe
sudo mkdir -p /var/www/sti-staging

# Set ownership (replace 'user' with your username)
sudo chown -R $USER:$USER /var/www/sti-fe
sudo chown -R $USER:$USER /var/www/sti-staging
```

## PM2 Configuration

### 1. Create PM2 Ecosystem File

Create an `ecosystem.config.js` file in your project root (optional, for reference):

```javascript
module.exports = {
  apps: [
    {
      name: 'sti-fe',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4000',
      cwd: '/var/www/sti-fe',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/www/sti-fe/logs/err.log',
      out_file: '/var/www/sti-fe/logs/out.log',
      log_file: '/var/www/sti-fe/logs/combined.log',
      time: true
    },
    {
      name: 'sti-staging',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4005',
      cwd: '/var/www/sti-staging',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4005
      },
      error_file: '/var/www/sti-staging/logs/err.log',
      out_file: '/var/www/sti-staging/logs/out.log',
      log_file: '/var/www/sti-staging/logs/combined.log',
      time: true
    }
  ]
};
```

### 2. Start Applications with PM2

```bash
# Production
cd /var/www/sti-fe
pm2 start npm --name "sti-fe" -- start -- -p 4000

# Staging
cd /var/www/sti-staging
pm2 start npm --name "sti-staging" -- start -- -p 4005

# Save PM2 process list
pm2 save

# View running processes
pm2 list

# View logs
pm2 logs sti-fe
pm2 logs sti-staging
```

### 3. PM2 Common Commands

```bash
# List all processes
pm2 list

# View logs
pm2 logs [process-name]
pm2 logs sti-fe --lines 100

# Monitor processes
pm2 monit

# Restart processes
pm2 restart sti-fe
pm2 restart sti-staging
pm2 restart all

# Stop processes
pm2 stop sti-fe
pm2 stop sti-staging

# Delete processes
pm2 delete sti-fe
pm2 delete sti-staging

# View process info
pm2 info sti-fe

# Flush logs
pm2 flush
```

## Nginx Configuration

### 1. Production Configuration

Create file: `/etc/nginx/sites-available/sti.dinus.id`

```nginx
server {
    server_name sti.dinus.id;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    error_log /var/log/nginx/sti-dinus.error.log;
    access_log /var/log/nginx/sti-dinus.access.log;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/sti.dinus.id/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/sti.dinus.id/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = sti.dinus.id) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    server_name sti.dinus.id;
    listen 80;
    return 404; # managed by Certbot
}
```

### 2. Staging Configuration

Create file: `/etc/nginx/sites-available/dev-sti.dinus.id`

```nginx
server {
    server_name dev-sti.dinus.id;

    location / {
        proxy_pass http://localhost:4005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    error_log /var/log/nginx/dev-sti-dinus.error.log;
    access_log /var/log/nginx/dev-sti-dinus.access.log;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/dev-sti.dinus.id/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/dev-sti.dinus.id/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = dev-sti.dinus.id) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    server_name dev-sti.dinus.id;
    listen 80;
    return 404; # managed by Certbot
}
```

### 3. Enable Sites and Test Configuration

```bash
# Create symbolic links to enable sites
sudo ln -s /etc/nginx/sites-available/sti.dinus.id /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dev-sti.dinus.id /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 4. Nginx Common Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/sti-dinus.error.log
sudo tail -f /var/log/nginx/dev-sti-dinus.error.log

# View access logs
sudo tail -f /var/log/nginx/sti-dinus.access.log
sudo tail -f /var/log/nginx/dev-sti-dinus.access.log
```

## SSL Certificate Setup

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Obtain SSL Certificates

```bash
# For production domain
sudo certbot --nginx -d sti.dinus.id

# For staging domain
sudo certbot --nginx -d dev-sti.dinus.id
```

### 3. Verify Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

### 4. Manual Renewal (if needed)

```bash
sudo certbot renew
sudo systemctl reload nginx
```

## GitHub Actions CI/CD

### 1. Required GitHub Secrets

Navigate to your repository: `Settings` → `Secrets and variables` → `Actions`

Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SERVER_IP` | Server IP address | `123.456.789.0` |
| `SSH_USER` | SSH username | `root` or your username |
| `SSH_KEY` | Private SSH key | Content of `~/.ssh/id_rsa` |
| `ENV_STAGING` | Staging environment variables | Complete .env file content |
| `ENV_PRODUCTION` | Production environment variables | Complete .env file content |

### 2. Generate SSH Key Pair (if not exists)

On your local machine or server:

```bash
# Generate key pair
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server-ip

# Display private key (copy this to SSH_KEY secret)
cat ~/.ssh/id_rsa
```

### 3. CI/CD Workflow Explanation

The workflow file `.github/workflows/main.yml` performs the following steps:

#### Trigger Conditions
```yaml
on:
  push:
    branches:
      - staging      # Triggers on push to staging branch
      - production   # Triggers on push to production branch
```

#### Workflow Steps

1. **Checkout Code**: Clones the repository
2. **Setup Node.js**: Installs Node.js 18
3. **Create .env File**: Uses appropriate secrets based on branch
4. **Install Dependencies**: Runs `npm ci` for clean install
5. **Build Project**: Runs `npm run build`
6. **Create Build Package**: Compresses build artifacts
7. **Upload to Server**: Uploads build package via SCP
8. **Extract and Restart**: Extracts files and restarts PM2 process

### 4. Environment Variables Format

Your `ENV_STAGING` and `ENV_PRODUCTION` secrets should contain:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENV=production

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Other configurations
NEXT_PUBLIC_APP_NAME=STI
# ... add all your environment variables
```

## Deployment Workflow

### Branch Strategy

```
development (local dev)
    ↓
staging (auto-deploy to dev-sti.dinus.id)
    ↓
production (auto-deploy to sti.dinus.id)
```

### Deployment Process

#### 1. Deploy to Staging

```bash
# Ensure you're on development branch
git checkout development

# Make your changes and commit
git add .
git commit -m "feat: your feature description"

# Merge to staging
git checkout staging
git merge development
git push origin staging
```

This will trigger GitHub Actions to:
- Build the application
- Deploy to `/var/www/sti-staging`
- Restart `sti-staging` PM2 process
- Available at `dev-sti.dinus.id`

#### 2. Deploy to Production

After testing on staging:

```bash
# Merge staging to production
git checkout production
git merge staging
git push origin production
```

This will trigger GitHub Actions to:
- Build the application
- Deploy to `/var/www/sti-fe`
- Restart `sti-fe` PM2 process
- Available at `sti.dinus.id`

### Monitoring Deployment

#### Via GitHub Actions
1. Go to your repository on GitHub
2. Click on "Actions" tab
3. View the running workflow
4. Check logs for each step

#### Via Server Logs
```bash
# SSH to server
ssh user@server-ip

# Watch PM2 logs
pm2 logs sti-fe --lines 50
pm2 logs sti-staging --lines 50

# Check Nginx logs
sudo tail -f /var/log/nginx/sti-dinus.error.log
```

## Best Practices

### 1. Branch Management

- **Never commit directly to `production` or `staging` branches**
- Always work on `development` or feature branches
- Use Pull Requests for code review before merging
- Keep branches synchronized: `development` → `staging` → `production`

### 2. Environment Variables

- **Never commit `.env` files to repository**
- Use GitHub Secrets for sensitive data
- Maintain separate configs for staging and production
- Document all required environment variables

### 3. Testing Before Production

- Always test features on `staging` first
- Perform smoke tests after deployment
- Check logs for errors
- Verify critical features work correctly

### 4. Deployment Safety

- **Deploy during low-traffic hours** for production
- Keep backups before major deployments
- Monitor server resources (CPU, Memory, Disk)
- Have a rollback plan ready

### 5. Security

- **Keep SSH keys secure** and never share them
- Regularly update server packages: `sudo apt update && sudo apt upgrade`
- Monitor SSL certificate expiration
- Review Nginx and PM2 logs regularly
- Use strong passwords and enable 2FA on GitHub

### 6. Performance Optimization

```nginx
# Add to Nginx configuration for better performance
location /_next/static {
    proxy_cache STATIC;
    proxy_pass http://localhost:4000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location /static {
    proxy_cache STATIC;
    proxy_pass http://localhost:4000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 7. PM2 Best Practices

```bash
# Use cluster mode for better performance (if needed)
pm2 start npm --name "sti-fe" -i max -- start -- -p 4000

# Set up log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor memory usage
pm2 monit
```

### 8. Backup Strategy

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/sti-fe-$DATE.tar.gz /var/www/sti-fe
tar -czf /backups/sti-staging-$DATE.tar.gz /var/www/sti-staging

# Keep only last 7 days
find /backups -name "sti-*.tar.gz" -mtime +7 -delete
```

### 9. Health Checks

Create a health check endpoint in your Next.js app:

```tsx
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}
```

Monitor it regularly:
```bash
curl https://sti.dinus.id/api/health
curl https://dev-sti.dinus.id/api/health
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Deployment Fails on GitHub Actions

**Problem:** Build fails with dependency errors

```bash
# Solution: Clear npm cache
npm ci --legacy-peer-deps
```

Add to workflow if needed:
```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

**Problem:** SSH connection fails

```bash
# Check secrets are properly set
# Verify SSH_KEY has correct format (include -----BEGIN/END-----)
# Test SSH connection manually:
ssh -i ~/.ssh/id_rsa user@server-ip
```

#### 2. Application Not Starting

**Problem:** PM2 process crashes immediately

```bash
# Check PM2 logs
pm2 logs sti-fe --err

# Common causes:
# - Missing .env file
# - Port already in use
# - Build artifacts missing

# Check port usage
sudo lsof -i :4000
sudo lsof -i :4005

# Restart properly
cd /var/www/sti-fe
pm2 delete sti-fe
pm2 start npm --name "sti-fe" -- start -- -p 4000
pm2 save
```

#### 3. 502 Bad Gateway Error

**Problem:** Nginx returns 502 error

```bash
# Check if PM2 process is running
pm2 list

# Check if port is accessible
curl http://localhost:4000
curl http://localhost:4005

# Check Nginx error logs
sudo tail -f /var/log/nginx/sti-dinus.error.log

# Restart services
pm2 restart sti-fe
sudo systemctl restart nginx
```

#### 4. SSL Certificate Issues

**Problem:** Certificate expired or invalid

```bash
# Check certificate expiration
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

#### 5. Out of Memory

**Problem:** Server runs out of memory

```bash
# Check memory usage
free -h
pm2 monit

# Restart process with memory limit
pm2 restart sti-fe --max-memory-restart 1G

# Or add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### 6. Slow Build Times

**Problem:** GitHub Actions build takes too long

```yaml
# Add caching to workflow
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

#### 7. Permission Issues

**Problem:** Cannot write to deployment directory

```bash
# Fix directory permissions
sudo chown -R $USER:$USER /var/www/sti-fe
sudo chown -R $USER:$USER /var/www/sti-staging
sudo chmod -R 755 /var/www/sti-fe
sudo chmod -R 755 /var/www/sti-staging
```

#### 8. Environment Variables Not Loading

**Problem:** Application can't read environment variables

```bash
# Verify .env file exists
ls -la /var/www/sti-fe/.env
cat /var/www/sti-fe/.env

# Check if PM2 loads the .env
pm2 restart sti-fe --update-env

# Or restart from directory
cd /var/www/sti-fe
pm2 delete sti-fe
pm2 start npm --name "sti-fe" -- start -- -p 4000
```

### Emergency Rollback

If deployment causes critical issues:

```bash
# SSH to server
ssh user@server-ip

# Stop current process
pm2 stop sti-fe

# Restore from backup
cd /var/www
sudo rm -rf sti-fe
sudo tar -xzf /backups/sti-fe-YYYYMMDD_HHMMSS.tar.gz

# Restart
cd /var/www/sti-fe
pm2 restart sti-fe
```

### Debug Checklist

When troubleshooting, check in this order:

1. ✅ Is PM2 process running? `pm2 list`
2. ✅ Are there errors in PM2 logs? `pm2 logs`
3. ✅ Is the port accessible? `curl http://localhost:4000`
4. ✅ Is Nginx running? `sudo systemctl status nginx`
5. ✅ Are there Nginx errors? `sudo tail /var/log/nginx/error.log`
6. ✅ Is SSL certificate valid? `sudo certbot certificates`
7. ✅ Is .env file present? `ls -la /var/www/sti-fe/.env`
8. ✅ Is there enough disk space? `df -h`
9. ✅ Is there enough memory? `free -h`
10. ✅ Can the domain be resolved? `nslookup sti.dinus.id`

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review GitHub Actions logs
3. Check server logs (PM2 and Nginx)
4. Contact the development team

---

**Last Updated:** November 2025  
**Maintained By:** STI Development Team

