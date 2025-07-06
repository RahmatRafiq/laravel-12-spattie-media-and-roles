# 🐛 Troubleshooting Guide

## Common Docker Issues

### Port Conflicts

**Problem**: Port already in use error

**Solution**:
```bash
# Stop all containers first
make stop
# Or manually:
docker compose down

# Check what's using the port
sudo lsof -i :8000
sudo lsof -i :3308
```

### Database Connection Issues

**Problem**: Database connection refused or timeout

**Solution**:
```bash
# Wait for database to be ready
docker compose logs mariadb

# Check if database container is healthy
docker ps

# Restart if needed
make restart

# Reset database if corrupted
make clean
make setup
```

### Permission Issues

**Problem**: Permission denied errors in Laravel

**Solution**:
```bash
# Fix storage permissions
docker compose exec laravel.test chmod -R 775 storage
docker compose exec laravel.test chmod -R 775 bootstrap/cache

# Fix ownership if needed
docker compose exec laravel.test chown -R www-data:www-data storage
docker compose exec laravel.test chown -R www-data:www-data bootstrap/cache
```

### Missing APP_KEY Error

**Problem**: "No application encryption key has been specified"

**Solution**:
```bash
# Generate application key
make key-generate

# Or manually:
docker compose exec laravel.test php artisan key:generate
```

### Container Build Issues

**Problem**: Docker build failing or slow

**Solution**:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild with no cache
make clean
make dev-build

# Check available disk space
df -h
```

## Environment Configuration Issues

### Wrong Port Configuration

**Problem**: Application not accessible on expected port

**Solution**:
```bash
# Check your .env file
grep -E "APP_PORT|APP_URL" .env

# Update ports in .env
APP_PORT=9000
APP_URL=http://localhost:9000

# Restart containers
make restart
```

### Redis Connection Issues

**Problem**: Redis connection errors

**Solution**:
```bash
# Check Redis container
docker compose logs redis

# Test Redis connection
docker compose exec laravel.test php artisan tinker
>>> Redis::ping()

# Check Redis configuration in .env
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Mail Configuration Issues

**Problem**: Emails not sending or Mailpit not working

**Solution**:
```bash
# Check Mailpit container
docker compose logs mailpit

# Test email sending
docker compose exec laravel.test php artisan tinker
>>> Mail::raw('Test email', function ($message) {
...     $message->to('test@example.com')->subject('Test');
... });

# Access Mailpit dashboard
http://localhost:8026
```

## Application Issues

### Migration Errors

**Problem**: Migration failing

**Solution**:
```bash
# Check migration status
docker compose exec laravel.test php artisan migrate:status

# Rollback if needed
docker compose exec laravel.test php artisan migrate:rollback

# Fresh migration
docker compose exec laravel.test php artisan migrate:fresh

# Check database connection
docker compose exec laravel.test php artisan tinker
>>> DB::connection()->getPdo()
```

### Composer Issues

**Problem**: Composer install failing

**Solution**:
```bash
# Clear composer cache
docker compose exec laravel.test composer clear-cache

# Update composer
docker compose exec laravel.test composer self-update

# Install with verbose output
docker compose exec laravel.test composer install -v

# Check PHP version compatibility
docker compose exec laravel.test php -v
```

### NPM/Asset Issues

**Problem**: NPM install or build failing

**Solution**:
```bash
# Clear NPM cache
docker compose exec laravel.test npm cache clean --force

# Delete node_modules and reinstall
docker compose exec laravel.test rm -rf node_modules
docker compose exec laravel.test npm install

# Check Node version
docker compose exec laravel.test node -v
docker compose exec laravel.test npm -v

# Build with verbose output
docker compose exec laravel.test npm run build --verbose
```

## Performance Issues

### Slow Container Startup

**Problem**: Containers taking too long to start

**Solution**:
```bash
# Check system resources
docker stats

# Clean unused resources
docker system prune -f

# Use specific PHP version
# Edit docker-compose.yml to use sail-8.3/app instead of sail-8.4/app

# Check available memory
free -h
```

### Slow Database Queries

**Problem**: Application running slowly

**Solution**:
```bash
# Enable query logging
docker compose exec laravel.test php artisan tinker
>>> DB::enableQueryLog()
>>> // Run your operations
>>> DB::getQueryLog()

# Check database performance
docker compose exec mariadb mysql -u sail -p -e "SHOW PROCESSLIST;"

# Optimize database
docker compose exec laravel.test php artisan optimize
```

## Production Deployment Issues

### SSL/HTTPS Issues

**Problem**: SSL not working in production

**Solution**:
1. Update APP_URL to use https
2. Configure reverse proxy (Nginx/Apache)
3. Install SSL certificates
4. Update Docker compose for production

### Environment Variables

**Problem**: Environment variables not loading

**Solution**:
```bash
# Check if .env file exists
ls -la .env

# Verify environment loading
docker compose exec laravel.test php artisan config:show

# Clear and cache config
docker compose exec laravel.test php artisan config:clear
docker compose exec laravel.test php artisan config:cache
```

## Getting Help

If you're still experiencing issues:

1. **Check Logs**:
   ```bash
   # Application logs
   docker compose exec laravel.test tail -f storage/logs/laravel.log
   
   # Container logs
   docker compose logs -f
   ```

2. **Debug Mode**:
   ```bash
   # Enable debug in .env
   APP_DEBUG=true
   
   # Restart application
   make restart
   ```

3. **Community Support**:
   - Check GitHub Issues
   - Laravel Community Forums
   - Docker Community Forums
