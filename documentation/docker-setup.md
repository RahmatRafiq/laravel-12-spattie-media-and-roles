# 🐳 Docker Quick Start Guide

## Development Environment (Recommended)

### Prerequisites
- Docker installed
- Docker Compose v2

### Quick Setup

1. **Clone and setup**
   ```bash
   git clone <your-repo-url>
   cd laravel-12-spattie-media-and-roles
   cp .env.example .env
   ```

2. **Generate application key**
   ```bash
   # Start containers first
   make dev
   
   # Generate APP_KEY
   docker compose exec laravel.test php artisan key:generate
   ```

3. **Complete setup (alternative one-command)**
   ```bash
   make setup
   ```

4. **Access your application**
   - **Application**: http://localhost:8000
   - **Mailpit (Email Testing)**: http://localhost:8026
   - **Database**: localhost:3308

### Production Deployment

1. **Setup production environment**
   ```bash
   cp .env.production .env
   # Edit .env with your production settings
   ```

2. **Deploy to production**
   ```bash
   ./deploy.sh production
   ```

3. **Access production app**: http://localhost:8080

## Docker Services

### Development (Laravel Sail)
- **Laravel App**: Port 8000 (instead of default 80 to avoid conflicts)
- **MariaDB**: Port 3308 (instead of default 3306)
- **Redis**: Port 6380 (instead of default 6379)
- **Mailpit**: Port 8026 (instead of default 8025)

### Production
- **Nginx + PHP-FPM**: Optimized web server
- **MariaDB**: Production database
- **Redis**: Caching and sessions
- **Supervisor**: Queue workers and scheduled tasks

## Quick Commands (using Makefile)

The easiest way to manage your Docker setup:

```bash
# Start development environment
make dev

# Complete setup for new installation
make setup

# Stop all containers
make stop

# Clean everything and start fresh
make clean && make setup

# View all available commands
make help
```

## Manual Docker Commands

### Development
```bash
# Start containers
docker compose up -d

# View running containers
docker ps

# Access Laravel container shell
docker compose exec laravel.test bash

# Run migrations
docker compose exec laravel.test php artisan migrate

# Install PHP dependencies
docker compose exec laravel.test composer install

# Install Node dependencies
docker compose exec laravel.test npm install

# Build assets
docker compose exec laravel.test npm run build

# Watch for file changes (development)
docker compose exec laravel.test npm run dev
```

### Production
```bash
# Start production environment
docker compose -f docker-compose.prod.yml up -d --build

# Check logs
docker compose -f docker-compose.prod.yml logs -f

# Stop production
docker compose -f docker-compose.prod.yml down
```

## Environment Configuration

### Development (.env)
The development environment uses these non-conflicting ports:
- App: 8000 (instead of 80)
- Database: 3308 (instead of 3306)  
- Redis: 6380 (instead of 6379)
- Mailpit: 8026 (instead of 8025)

### Production (.env.production)
Create your production environment file:
```bash
cp .env.production .env
# Edit the file with your production settings
```
