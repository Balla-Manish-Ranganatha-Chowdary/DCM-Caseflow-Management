# 🚀 Deployment Guide - Differential Case Management System

Complete guide for deploying the Case Management System to production environments.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Options](#deployment-options)
3. [Option 1: Traditional Server (VPS)](#option-1-traditional-server-vps)
4. [Option 2: Cloud Platform (AWS)](#option-2-cloud-platform-aws)
5. [Option 3: Docker Deployment](#option-3-docker-deployment)
6. [Option 4: Heroku + Vercel](#option-4-heroku--vercel)
7. [Database Setup](#database-setup)
8. [Environment Configuration](#environment-configuration)
9. [SSL/HTTPS Setup](#sslhttps-setup)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Security
- [ ] Change SECRET_KEY in .env to a strong random string
- [ ] Update CORS origins to production domains
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure password policies
- [ ] Review and restrict database access
- [ ] Enable rate limiting
- [ ] Set up firewall rules

### Configuration
- [ ] Update DATABASE_URL for production database
- [ ] Configure production API endpoints in frontend
- [ ] Set up environment variables
- [ ] Configure file upload limits
- [ ] Set up backup strategy
- [ ] Configure logging

### Testing
- [ ] Run all test cases
- [ ] Test with production-like data
- [ ] Load testing
- [ ] Security audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check

---

## 🎯 Deployment Options

### Comparison Table

| Option | Cost | Difficulty | Scalability | Best For |
|--------|------|------------|-------------|----------|
| VPS (DigitalOcean, Linode) | $5-20/mo | Medium | Medium | Small to medium projects |
| AWS (EC2 + RDS) | $20-100/mo | Hard | High | Enterprise applications |
| Docker (Any host) | Varies | Medium | High | Containerized deployments |
| Heroku + Vercel | $7-25/mo | Easy | Medium | Quick deployments |

---

## 🖥️ Option 1: Traditional Server (VPS)

### Recommended Providers
- DigitalOcean ($5-20/month)
- Linode ($5-20/month)
- Vultr ($5-20/month)

### Step 1: Server Setup

```bash
# 1. Create a VPS (Ubuntu 22.04 LTS recommended)
# Minimum specs: 2GB RAM, 1 CPU, 50GB Storage

# 2. SSH into your server
ssh root@your-server-ip

# 3. Update system
apt update && apt upgrade -y

# 4. Install required software
apt install -y python3.10 python3-pip python3-venv nginx mysql-server nodejs npm git

# 5. Install certbot for SSL
apt install -y certbot python3-certbot-nginx
```

### Step 2: MySQL Database Setup

```bash
# Secure MySQL installation
mysql_secure_installation

# Create database and user
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE case_management;
CREATE USER 'caseuser'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON case_management.* TO 'caseuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u caseuser -p case_management < /path/to/database_schema.sql
```

### Step 3: Backend Deployment

```bash
# 1. Create application directory
mkdir -p /var/www/case-management
cd /var/www/case-management

# 2. Clone repository
git clone https://github.com/yourusername/case-management-system.git .

# 3. Setup backend
cd Back-End
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Create production .env
cat > .env << EOF
DATABASE_URL=mysql+pymysql://caseuser:strong_password_here@localhost:3306/case_management
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF

# 5. Create systemd service
sudo nano /etc/systemd/system/case-backend.service
```

**case-backend.service:**
```ini
[Unit]
Description=Case Management Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/case-management/Back-End
Environment="PATH=/var/www/case-management/Back-End/venv/bin"
ExecStart=/var/www/case-management/Back-End/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

```bash
# Install Gunicorn
pip install gunicorn

# Start and enable service
sudo systemctl start case-backend
sudo systemctl enable case-backend
sudo systemctl status case-backend
```

### Step 4: Frontend Deployment

```bash
# 1. Build frontend
cd /var/www/case-management/Front-End

# 2. Update API endpoint
# Edit src/config.js or create it:
cat > src/config.js << EOF
export const API_BASE_URL = 'https://api.yourdomain.com';
EOF

# 3. Update all fetch calls to use API_BASE_URL
# Replace 'http://localhost:8000' with API_BASE_URL in all files

# 4. Build for production
npm install
npm run build

# 5. Copy build to nginx directory
sudo cp -r dist/* /var/www/html/
```

### Step 5: Nginx Configuration

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/case-management
```

**nginx configuration:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File upload size limit
    client_max_body_size 10M;
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/case-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL Certificate

```bash
# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

## ☁️ Option 2: Cloud Platform (AWS)

### Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                    │
└─────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
┌───────▼────────┐                 ┌───────▼────────┐
│  CloudFront    │                 │   CloudFront   │
│   (Frontend)   │                 │   (API CDN)    │
└───────┬────────┘                 └───────┬────────┘
        │                                   │
┌───────▼────────┐                 ┌───────▼────────┐
│   S3 Bucket    │                 │  Load Balancer │
│  (Static Site) │                 └───────┬────────┘
└────────────────┘                         │
                                   ┌───────▼────────┐
                                   │   EC2 Instance │
                                   │   (Backend)    │
                                   └───────┬────────┘
                                           │
                                   ┌───────▼────────┐
                                   │   RDS MySQL    │
                                   │   (Database)   │
                                   └────────────────┘
```

### Step 1: RDS Database Setup

```bash
# 1. Create RDS MySQL instance
# - Go to AWS RDS Console
# - Create database
# - Engine: MySQL 8.0
# - Template: Production or Dev/Test
# - DB instance: db.t3.micro (free tier) or larger
# - Storage: 20GB minimum
# - Enable automated backups
# - Note down endpoint and credentials

# 2. Connect and import schema
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p
# Import database_schema.sql
```

### Step 2: EC2 Backend Setup

```bash
# 1. Launch EC2 instance
# - AMI: Ubuntu 22.04 LTS
# - Instance type: t2.micro (free tier) or t2.small
# - Security group: Allow ports 22, 80, 443, 8000

# 2. SSH into instance
ssh -i your-key.pem ubuntu@ec2-instance-ip

# 3. Follow VPS backend setup steps above
# 4. Update DATABASE_URL to use RDS endpoint
```

### Step 3: S3 + CloudFront Frontend

```bash
# 1. Build frontend locally
cd Front-End
npm run build

# 2. Create S3 bucket
aws s3 mb s3://your-case-management-frontend

# 3. Upload build files
aws s3 sync dist/ s3://your-case-management-frontend --acl public-read

# 4. Enable static website hosting
aws s3 website s3://your-case-management-frontend --index-document index.html

# 5. Create CloudFront distribution
# - Origin: S3 bucket
# - Viewer Protocol Policy: Redirect HTTP to HTTPS
# - Alternate Domain Names: yourdomain.com
# - SSL Certificate: Request from ACM
```

### Step 4: Load Balancer (Optional)

```bash
# For high availability, set up Application Load Balancer
# 1. Create target group with EC2 instances
# 2. Create ALB
# 3. Configure health checks
# 4. Update CloudFront origin to ALB
```

---

## 🐳 Option 3: Docker Deployment

### Step 1: Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
# Back-End/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile:**
```dockerfile
# Front-End/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Step 2: Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  database:
    image: mysql:8.0
    container_name: case-db
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: case_management
      MYSQL_USER: caseuser
      MYSQL_PASSWORD: casepassword
    volumes:
      - db_data:/var/lib/mysql
      - ./Back-End/database_schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "3306:3306"
    networks:
      - case-network

  backend:
    build: ./Back-End
    container_name: case-backend
    environment:
      DATABASE_URL: mysql+pymysql://caseuser:casepassword@database:3306/case_management
      SECRET_KEY: your-secret-key-here
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 30
    volumes:
      - ./Back-End/uploads:/app/uploads
    ports:
      - "8000:8000"
    depends_on:
      - database
    networks:
      - case-network

  frontend:
    build: ./Front-End
    container_name: case-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - case-network

volumes:
  db_data:

networks:
  case-network:
    driver: bridge
```

### Step 3: Deploy with Docker

```bash
# 1. Build and start containers
docker-compose up -d

# 2. Check status
docker-compose ps

# 3. View logs
docker-compose logs -f

# 4. Stop containers
docker-compose down

# 5. Update and restart
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🎨 Option 4: Heroku + Vercel (Easiest)

### Backend on Heroku

```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
cd Back-End
heroku create your-case-backend

# 4. Add MySQL addon
heroku addons:create jawsdb:kitefin

# 5. Get database URL
heroku config:get JAWSDB_URL

# 6. Set environment variables
heroku config:set SECRET_KEY=$(openssl rand -hex 32)
heroku config:set ALGORITHM=HS256
heroku config:set ACCESS_TOKEN_EXPIRE_MINUTES=30

# 7. Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# 8. Create runtime.txt
echo "python-3.10.12" > runtime.txt

# 9. Deploy
git init
git add .
git commit -m "Initial deployment"
git push heroku main

# 10. Import database
heroku run python
# Then import schema manually or use migration script
```

### Frontend on Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd Front-End
vercel

# 4. Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-case-backend.herokuapp.com

# 5. Production deployment
vercel --prod
```

---

## 🗄️ Database Setup

### Production Database Configuration

```sql
-- Create production database
CREATE DATABASE case_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with limited privileges
CREATE USER 'case_prod'@'%' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON case_management.* TO 'case_prod'@'%';
FLUSH PRIVILEGES;

-- Import schema
USE case_management;
SOURCE /path/to/database_schema.sql;

-- Create indexes for performance
CREATE INDEX idx_cases_user_filed ON cases(user_id, filed_at);
CREATE INDEX idx_cases_judge_status ON cases(judge_id, status);
CREATE INDEX idx_hearings_date ON hearings(scheduled_date, scheduled_time);

-- Set up automated backups
-- (Varies by hosting provider)
```

### Backup Strategy

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="case_management"
DB_USER="backup_user"
DB_PASS="backup_password"

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-backup-bucket/
```

---

## ⚙️ Environment Configuration

### Production .env Template

```env
# Database
DATABASE_URL=mysql+pymysql://user:password@host:3306/database

# Security
SECRET_KEY=your-super-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# File Upload
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=/var/www/uploads

# Email (for future notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/case-management/app.log
```

### Frontend Environment

```javascript
// Front-End/.env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Case Management System
VITE_MAX_FILE_SIZE=10485760
```

---

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already set up)
sudo certbot renew --dry-run
```

### Using Cloudflare (Free SSL + CDN)

1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers at your registrar
4. Enable "Full (strict)" SSL mode
5. Enable "Always Use HTTPS"
6. Configure page rules for caching

---

## 📊 Monitoring & Maintenance

### Application Monitoring

```bash
# Install monitoring tools
pip install prometheus-fastapi-instrumentator

# Add to main.py
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
Instrumentator().instrument(app).expose(app)
```

### Log Management

```python
# Add to main.py
import logging
from logging.handlers import RotatingFileHandler

# Configure logging
handler = RotatingFileHandler(
    'logs/app.log',
    maxBytes=10000000,
    backupCount=5
)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[handler]
)
```

### Health Checks

```python
# Add health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": check_database_connection(),
        "timestamp": datetime.now()
    }
```

### Monitoring Services

- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry
- **Performance**: New Relic or DataDog
- **Logs**: Papertrail or Loggly

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Database Connection Failed**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check connection
mysql -h host -u user -p

# Check firewall
sudo ufw status
sudo ufw allow 3306
```

**Issue: Backend Not Starting**
```bash
# Check logs
sudo journalctl -u case-backend -f

# Check port availability
sudo netstat -tulpn | grep 8000

# Test manually
cd /var/www/case-management/Back-End
source venv/bin/activate
uvicorn main:app --reload
```

**Issue: Frontend Not Loading**
```bash
# Check nginx
sudo nginx -t
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log

# Rebuild frontend
cd Front-End
npm run build
```

**Issue: File Upload Fails**
```bash
# Check permissions
sudo chown -R www-data:www-data /var/www/case-management/Back-End/uploads
sudo chmod -R 755 /var/www/case-management/Back-End/uploads

# Check nginx upload size
# In /etc/nginx/nginx.conf:
client_max_body_size 10M;
```

---

## 📝 Post-Deployment Checklist

- [ ] Test all user workflows
- [ ] Verify SSL certificate
- [ ] Check database backups
- [ ] Set up monitoring alerts
- [ ] Configure log rotation
- [ ] Test file uploads
- [ ] Verify email notifications (if implemented)
- [ ] Load testing
- [ ] Security scan
- [ ] Update DNS records
- [ ] Document deployment process
- [ ] Train administrators

---

## 🎯 Performance Optimization

### Backend Optimization

```python
# Add caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
```

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_cases_status_date ON cases(status, scheduled_date);
CREATE INDEX idx_users_email ON users(email);

-- Optimize tables
OPTIMIZE TABLE cases;
OPTIMIZE TABLE users;
OPTIMIZE TABLE judges;
```

### Frontend Optimization

```bash
# Enable gzip compression in nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Enable browser caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📞 Support

For deployment issues:
- Check logs first
- Review this guide
- Check GitHub issues
- Contact: your.email@example.com

---

**Last Updated**: November 2024  
**Version**: 1.0.0
