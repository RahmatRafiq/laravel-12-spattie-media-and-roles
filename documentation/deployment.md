# 🚀 Deployment Guide

## Production Deployment with Docker

### Prerequisites

- Docker installed on production server
- Docker Compose v2
- Domain name (optional)
- SSL certificates (recommended)

### Server Preparation

1. **Install Docker and Docker Compose**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io docker-compose-v2
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Restart session
   logout
   # Login again
   ```

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd laravel-12-spattie-media-and-roles
   ```

### Environment Configuration

1. **Create Production Environment**
   ```bash
   cp .env.production .env
   ```

2. **Update Environment Variables**
   ```bash
   nano .env
   ```

   Key variables to configure:
   ```env
   APP_NAME="Your App Name"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   # Database
   DB_CONNECTION=mariadb
   DB_HOST=mariadb
   DB_DATABASE=your_production_db
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_secure_password

   # Mail Configuration
   MAIL_MAILER=smtp
   MAIL_HOST=your-smtp-host
   MAIL_PORT=587
   MAIL_USERNAME=your-email@yourdomain.com
   MAIL_PASSWORD=your-email-password
   MAIL_ENCRYPTION=tls

   # Session Security
   SESSION_ENCRYPT=true
   SESSION_DOMAIN=yourdomain.com
   ```

### Quick Deployment

```bash
# One-command deployment
./deploy.sh production
```

### Manual Deployment Steps

1. **Build and Start Production Containers**
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

2. **Generate Application Key**
   ```bash
   docker compose -f docker-compose.prod.yml exec app php artisan key:generate --force
   ```

3. **Run Migrations**
   ```bash
   docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
   ```

4. **Optimize Application**
   ```bash
   docker compose -f docker-compose.prod.yml exec app php artisan config:cache
   docker compose -f docker-compose.prod.yml exec app php artisan route:cache
   docker compose -f docker-compose.prod.yml exec app php artisan view:cache
   ```

5. **Set File Permissions**
   ```bash
   docker compose -f docker-compose.prod.yml exec app chown -R www-data:www-data storage
   docker compose -f docker-compose.prod.yml exec app chmod -R 775 storage
   ```

## Traditional VPS Deployment

### Server Requirements

- PHP 8.2+
- MySQL/MariaDB
- Redis
- Nginx/Apache
- Node.js & NPM
- Composer

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <your-repo-url> /var/www/html/your-app
   cd /var/www/html/your-app
   ```

2. **Install Dependencies**
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install
   npm run build
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**
   ```bash
   php artisan migrate --force
   ```

5. **Set Permissions**
   ```bash
   sudo chown -R www-data:www-data /var/www/html/your-app
   sudo chmod -R 775 /var/www/html/your-app/storage
   sudo chmod -R 775 /var/www/html/your-app/bootstrap/cache
   ```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/html/your-app/public;
    index index.php;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Handle Laravel routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP processing
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

### SSL Configuration with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (add to crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

## Cloud Deployment

### AWS EC2 with Docker

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security groups: 80, 443, 22

2. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose-v2
   sudo usermod -aG docker ubuntu
   ```

3. **Deploy Application**
   ```bash
   git clone <your-repo-url>
   cd laravel-12-spattie-media-and-roles
   cp .env.production .env
   # Edit .env with production values
   ./deploy.sh production
   ```

### DigitalOcean Droplet

1. **Create Droplet**
   - Ubuntu 22.04
   - 2GB RAM minimum
   - Add your SSH key

2. **Domain Setup**
   - Point A record to droplet IP
   - Configure DNS

3. **Deploy**
   ```bash
   # Same as AWS EC2 steps
   ```

### Using Docker Compose with Traefik (Advanced)

```yaml
# docker-compose.traefik.yml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=your-email@domain.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - web

  app:
    build:
      context: .
      dockerfile: docker/production/Dockerfile
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
    networks:
      - web
      - internal

networks:
  web:
    external: true
  internal:
    external: false
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check application status
curl -f http://yourdomain.com/health || echo "App is down"

# Check database connection
docker compose exec app php artisan tinker --execute="DB::connection()->getPdo()"

# Check Redis connection
docker compose exec app php artisan tinker --execute="Redis::ping()"
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh

# Database backup
docker compose exec mariadb mysqldump -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE > backup_$(date +%Y%m%d_%H%M%S).sql

# Storage backup
tar -czf storage_backup_$(date +%Y%m%d_%H%M%S).tar.gz storage/

# Upload to S3 (optional)
aws s3 cp backup_*.sql s3://your-backup-bucket/
aws s3 cp storage_backup_*.tar.gz s3://your-backup-bucket/
```

### Log Management

```bash
# Rotate Laravel logs
docker compose exec app php artisan log:clear

# Docker logs
docker compose logs --tail=100 app

# System logs
sudo journalctl -u docker -f
```

### Updates and Maintenance

```bash
# Update application
git pull origin main
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Database migrations
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force

# Clear caches
docker compose -f docker-compose.prod.yml exec app php artisan optimize:clear
docker compose -f docker-compose.prod.yml exec app php artisan optimize
```

## Security Considerations

### Environment Security

- Use strong passwords
- Enable two-factor authentication
- Regular security updates
- Firewall configuration
- SSH key authentication only

### Application Security

- Keep Laravel updated
- Regular dependency updates
- Security headers (CSP, HSTS)
- Input validation
- SQL injection prevention
- XSS protection

### Docker Security

- Use non-root user in containers
- Scan images for vulnerabilities
- Regular base image updates
- Limit container resources
- Network segmentation
