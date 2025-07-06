# 🔧 Commands Reference

## Makefile Commands

### Development Commands
```bash
make dev             # Start development environment
make dev-build       # Start development environment with rebuild
make restart         # Restart development environment
make stop            # Stop all containers
make clean           # Clean all Docker resources (containers, volumes, networks)
```

### Application Commands
```bash
make shell           # Open shell in Laravel container
make key-generate    # Generate application key
make migrate         # Run database migrations
make seed            # Seed database
make fresh           # Fresh migrate with seed
```

### Asset Commands
```bash
make install         # Install dependencies (Composer + NPM)
make build           # Build frontend assets
make watch           # Watch frontend assets for changes
```

### Cache Commands
```bash
make cache-clear     # Clear all Laravel caches
make cache-optimize  # Optimize for production
```

### Utility Commands
```bash
make logs            # Show container logs
make status          # Show container status
make help            # Show all available commands
```

### Quick Setup Commands
```bash
make setup           # Complete setup for new installation
make quick-start     # One command to start everything
```

### Production Commands
```bash
make prod            # Start production environment
```

## Docker Compose Commands

### Development Environment
```bash
# Start containers
docker compose up -d

# Start with build
docker compose up -d --build

# Stop containers
docker compose down

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f laravel.test
docker compose logs -f mariadb
docker compose logs -f redis
docker compose logs -f mailpit

# Execute commands in containers
docker compose exec laravel.test bash
docker compose exec laravel.test php artisan migrate
docker compose exec mariadb mysql -u sail -p
```

### Production Environment
```bash
# Start production environment
docker compose -f docker-compose.prod.yml up -d --build

# Stop production environment
docker compose -f docker-compose.prod.yml down

# View production logs
docker compose -f docker-compose.prod.yml logs -f

# Execute commands in production
docker compose -f docker-compose.prod.yml exec app bash
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

## Laravel Artisan Commands

### Basic Commands
```bash
# Application key
php artisan key:generate

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Database Commands
```bash
# Run migrations
php artisan migrate

# Run migrations with force (production)
php artisan migrate --force

# Rollback migrations
php artisan migrate:rollback

# Fresh migration with seed
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status

# Run seeders
php artisan db:seed

# Create migration
php artisan make:migration create_table_name
```

### Model and Controller Commands
```bash
# Create model
php artisan make:model ModelName

# Create model with migration
php artisan make:model ModelName -m

# Create controller
php artisan make:controller ControllerName

# Create resource controller
php artisan make:controller ControllerName --resource

# Create API controller
php artisan make:controller ControllerName --api
```

### Queue Commands
```bash
# Start queue worker
php artisan queue:work

# Start queue worker with timeout
php artisan queue:work --timeout=60

# Clear failed jobs
php artisan queue:clear

# Restart queue workers
php artisan queue:restart
```

### Storage Commands
```bash
# Create storage link
php artisan storage:link

# Clear storage cache
php artisan storage:clear
```

## NPM Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for development
npm run build

# Watch for changes
npm run watch
```

### Production
```bash
# Install production dependencies only
npm ci --production

# Build for production
npm run build

# Build with analysis
npm run build -- --analyze
```

### Maintenance
```bash
# Update dependencies
npm update

# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Clean cache
npm cache clean --force
```

## Composer Commands

### Basic Commands
```bash
# Install dependencies
composer install

# Install production dependencies only
composer install --no-dev --optimize-autoloader

# Update dependencies
composer update

# Update specific package
composer update vendor/package-name
```

### Autoload Commands
```bash
# Generate optimized autoload files
composer dump-autoload

# Generate optimized autoload for production
composer dump-autoload --optimize --classmap-authoritative
```

### Package Management
```bash
# Add new package
composer require vendor/package-name

# Add development package
composer require --dev vendor/package-name

# Remove package
composer remove vendor/package-name

# Show package information
composer show vendor/package-name
```

## Docker Commands

### Container Management
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop container_id

# Remove container
docker rm container_id

# Execute command in container
docker exec -it container_id bash
```

### Image Management
```bash
# List images
docker images

# Remove image
docker rmi image_id

# Build image
docker build -t image_name .

# Pull image
docker pull image_name
```

### System Management
```bash
# Show Docker system info
docker system info

# Show disk usage
docker system df

# Clean system
docker system prune

# Clean everything
docker system prune -a
```

### Volume Management
```bash
# List volumes
docker volume ls

# Remove volume
docker volume rm volume_name

# Inspect volume
docker volume inspect volume_name
```

### Network Management
```bash
# List networks
docker network ls

# Remove network
docker network rm network_name

# Inspect network
docker network inspect network_name
```

## Git Commands for Deployment

### Basic Deployment
```bash
# Pull latest changes
git pull origin main

# Check status
git status

# View recent commits
git log --oneline -10

# Create tag for release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Branch Management
```bash
# Switch to production branch
git checkout production

# Merge main to production
git merge main

# Push to production
git push origin production
```

## System Commands

### File Permissions
```bash
# Set Laravel permissions
sudo chown -R www-data:www-data /var/www/html/your-app
sudo chmod -R 775 /var/www/html/your-app/storage
sudo chmod -R 775 /var/www/html/your-app/bootstrap/cache
```

### Service Management (systemd)
```bash
# Start service
sudo systemctl start nginx
sudo systemctl start mysql
sudo systemctl start redis

# Stop service
sudo systemctl stop nginx

# Restart service
sudo systemctl restart nginx

# Enable service at boot
sudo systemctl enable nginx

# Check service status
sudo systemctl status nginx
```

### Log Commands
```bash
# View Laravel logs
tail -f storage/logs/laravel.log

# View system logs
sudo journalctl -f

# View specific service logs
sudo journalctl -u nginx -f
sudo journalctl -u mysql -f

# View Docker logs
docker logs -f container_name
```

## Backup and Restore Commands

### Database Backup
```bash
# MySQL/MariaDB backup
mysqldump -u username -p database_name > backup.sql

# Restore from backup
mysql -u username -p database_name < backup.sql

# Docker database backup
docker compose exec mariadb mysqldump -u sail -p laravel_starter > backup.sql
```

### File Backup
```bash
# Create compressed backup
tar -czf backup_$(date +%Y%m%d).tar.gz storage/ public/uploads/

# Extract backup
tar -xzf backup_20240101.tar.gz

# Sync files (rsync)
rsync -avz --progress source/ destination/
```
