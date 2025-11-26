# ✅ Deployment Checklist

Quick reference checklist for deploying the Case Management System.

---

## 🎯 Choose Your Deployment Method

- [ ] **Option 1**: VPS (DigitalOcean/Linode) - $5-20/month
- [ ] **Option 2**: AWS (EC2 + RDS) - $20-100/month  
- [ ] **Option 3**: Docker - Varies by host
- [ ] **Option 4**: Heroku + Vercel - $7-25/month

---

## 📋 Pre-Deployment (Do This First!)

### Security
- [ ] Generate strong SECRET_KEY: `openssl rand -hex 32`
- [ ] Update CORS origins in `main.py`
- [ ] Change all default passwords
- [ ] Review database user permissions
- [ ] Plan SSL certificate strategy

### Code Preparation
- [ ] Run all tests: `pytest` (backend) and `npm test` (frontend)
- [ ] Update API URLs in frontend code
- [ ] Remove console.log statements
- [ ] Build frontend: `npm run build`
- [ ] Create production .env file

### Database
- [ ] Export database schema
- [ ] Plan backup strategy
- [ ] Document database credentials securely

---

## 🗄️ Database Setup

- [ ] Create production MySQL database
- [ ] Create database user with limited privileges
- [ ] Import `database_schema.sql`
- [ ] Test database connection
- [ ] Set up automated backups
- [ ] Document connection string

**Connection String Format:**
```
mysql+pymysql://username:password@host:3306/database_name
```

---

## 🔧 Backend Deployment

### Server Setup
- [ ] Provision server (VPS/EC2/Container)
- [ ] Install Python 3.8+
- [ ] Install MySQL client
- [ ] Install nginx (if using VPS)
- [ ] Configure firewall (ports 22, 80, 443, 8000)

### Application Setup
- [ ] Clone repository
- [ ] Create virtual environment
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Create production .env file
- [ ] Test backend locally: `uvicorn main:app --reload`

### Production Server
- [ ] Install Gunicorn: `pip install gunicorn`
- [ ] Create systemd service (VPS) or configure platform
- [ ] Start backend service
- [ ] Verify backend is running: `curl http://localhost:8000`
- [ ] Check logs for errors

---

## 🎨 Frontend Deployment

### Build
- [ ] Update API endpoint in code
- [ ] Install dependencies: `npm install`
- [ ] Build for production: `npm run build`
- [ ] Test build locally: `npm run preview`

### Deploy
- [ ] Upload build files to server/CDN
- [ ] Configure web server (nginx/Apache)
- [ ] Set up routing for SPA
- [ ] Test frontend loads correctly

---

## 🌐 Domain & DNS

- [ ] Purchase domain name (if needed)
- [ ] Point domain to server IP
- [ ] Configure DNS records:
  - [ ] A record: `yourdomain.com` → Server IP
  - [ ] A record: `www.yourdomain.com` → Server IP
  - [ ] A record: `api.yourdomain.com` → Server IP (or same)
- [ ] Wait for DNS propagation (up to 48 hours)

---

## 🔒 SSL/HTTPS Setup

- [ ] Install certbot (if using Let's Encrypt)
- [ ] Generate SSL certificates
- [ ] Configure nginx/Apache for HTTPS
- [ ] Test HTTPS: `https://yourdomain.com`
- [ ] Force HTTPS redirect
- [ ] Set up auto-renewal

**Quick SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## 🧪 Post-Deployment Testing

### Functionality Tests
- [ ] Landing page loads
- [ ] User can register
- [ ] User can login
- [ ] User can file case
- [ ] File upload works
- [ ] Case gets scheduled
- [ ] User can check status
- [ ] Judge can login
- [ ] Judge can view cases
- [ ] Judge can schedule hearing
- [ ] Judge can close case
- [ ] Admin can login
- [ ] Admin can view analytics
- [ ] Admin can edit records
- [ ] Admin can delete records
- [ ] Logout works for all roles

### Technical Tests
- [ ] HTTPS works (no mixed content warnings)
- [ ] API endpoints respond correctly
- [ ] Database queries execute
- [ ] File uploads save correctly
- [ ] Sessions persist
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Load time acceptable (< 3 seconds)

---

## 📊 Monitoring Setup

- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log aggregation
- [ ] Create health check endpoint
- [ ] Configure alerts for downtime
- [ ] Set up performance monitoring

---

## 🔐 Security Hardening

- [ ] Enable firewall
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Install fail2ban
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Sanitize user inputs
- [ ] Set secure headers
- [ ] Regular security updates

---

## 💾 Backup Strategy

- [ ] Database backup script created
- [ ] Automated daily backups scheduled
- [ ] Backup retention policy set (30 days)
- [ ] Test backup restoration
- [ ] Off-site backup storage configured
- [ ] Document backup procedures

**Quick Backup Script:**
```bash
#!/bin/bash
mysqldump -u user -p database | gzip > backup_$(date +%Y%m%d).sql.gz
```

---

## 📝 Documentation

- [ ] Document server credentials (securely)
- [ ] Document database credentials
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures
- [ ] Share access with team members

---

## 🚀 Go Live!

- [ ] Announce maintenance window (if replacing existing system)
- [ ] Final backup of old system (if applicable)
- [ ] Switch DNS to new server
- [ ] Monitor for issues
- [ ] Test all critical paths
- [ ] Announce launch
- [ ] Monitor logs and metrics

---

## 📞 Emergency Contacts

**Document these before going live:**

- [ ] Hosting provider support
- [ ] Domain registrar support
- [ ] Database administrator
- [ ] Development team contacts
- [ ] Backup administrator

---

## 🔄 Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review performance metrics

### Weekly
- [ ] Review backup logs
- [ ] Check disk space
- [ ] Review security logs
- [ ] Update dependencies (if needed)

### Monthly
- [ ] Security updates
- [ ] Performance optimization
- [ ] Database optimization
- [ ] Review and archive old logs

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ All functionality works as expected
- ✅ HTTPS is enabled and working
- ✅ No console errors
- ✅ Database is accessible and backed up
- ✅ Monitoring is active
- ✅ Performance is acceptable
- ✅ Security measures are in place
- ✅ Documentation is complete

---

## 📊 Deployment Comparison

### Quick Reference

| Task | VPS | AWS | Docker | Heroku+Vercel |
|------|-----|-----|--------|---------------|
| Setup Time | 2-4 hours | 4-6 hours | 1-2 hours | 30 min |
| Difficulty | Medium | Hard | Medium | Easy |
| Monthly Cost | $10-20 | $30-100 | $10-30 | $15-25 |
| Scalability | Manual | Auto | Manual | Auto |
| Maintenance | High | Medium | Medium | Low |

---

## 🆘 Troubleshooting Quick Fixes

**Backend won't start:**
```bash
# Check logs
sudo journalctl -u case-backend -f
# Check port
sudo netstat -tulpn | grep 8000
```

**Database connection fails:**
```bash
# Test connection
mysql -h host -u user -p
# Check firewall
sudo ufw status
```

**Frontend shows blank page:**
```bash
# Check browser console (F12)
# Verify API URL is correct
# Check nginx config
sudo nginx -t
```

**SSL certificate issues:**
```bash
# Renew certificate
sudo certbot renew
# Check certificate
sudo certbot certificates
```

---

## ✅ Final Checklist

Before announcing launch:

- [ ] All tests passing
- [ ] HTTPS working
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Team trained
- [ ] Support plan ready
- [ ] Rollback plan documented

---

**🎉 Congratulations on your deployment!**

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

---

**Last Updated**: November 2024  
**Version**: 1.0.0
