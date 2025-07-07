# FrankenPHP Docker Setup untuk Laravel asd

Setup ini menggunakan FrankenPHP dengan Docker untuk menjalankan aplikasi Laravel dengan performa tinggi.

## Persyaratan

- Docker
- Docker Compose

## File yang Ditambahkan

- `Dockerfile.dev` - Dockerfile untuk development
- `Dockerfile` - Dockerfile untuk production
- `docker-compose.dev.yml` - Docker Compose untuk development
- `docker-compose.yml` - Docker Compose untuk production
- `Caddyfile` - Konfigurasi Caddy/FrankenPHP
- `frankenphp.sh` - Script helper untuk mengelola environment
- `.dockerignore` - File untuk mengoptimalkan Docker build

## Cara Penggunaan

### Development Environment

1. **Start development environment:**
   ```bash
   ./frankenphp.sh dev:start
   ```

2. **Stop development environment:**
   ```bash
   ./frankenphp.sh dev:stop
   ```

3. **Melihat logs:**
   ```bash
   ./frankenphp.sh logs
   ./frankenphp.sh logs vite  # untuk logs Vite
   ```

4. **Menjalankan perintah Laravel:**
   ```bash
   ./frankenphp.sh exec php artisan migrate
   ./frankenphp.sh exec php artisan make:model Product
   ./frankenphp.sh exec composer install
   ```

### Production Environment

1. **Start production environment:**
   ```bash
   ./frankenphp.sh prod:start
   ```

2. **Stop production environment:**
   ```bash
   ./frankenphp.sh prod:stop
   ```

## URL Akses

- **Application:** http://localhost:8000
- **Caddy Admin API:** http://localhost:2019 (development only)
- **Vite Dev Server:** http://localhost:5173 (development only)

## Fitur

### FrankenPHP Features
- **Worker Mode:** Untuk performa tinggi dengan persistent state
- **HTTP/2 & HTTP/3:** Support protokol modern
- **Built-in HTTPS:** Otomatis menggunakan Let's Encrypt di production
- **Static File Serving:** Caddy melayani file static dengan efisien
- **Gzip Compression:** Otomatis mengkompresi response

### Laravel Integration
- **Spatie Media Library:** Support untuk file handling
- **Activity Log:** Logging sudah dikonfigurasi
- **Permissions:** Spatie Permission sudah terintegrasi
- **Storage Link:** Otomatis dibuat saat startup

### Development Features
- **Hot Reload:** Vite development server untuk asset bundling
- **Volume Mounting:** Code changes langsung terdeteksi
- **Debug Mode:** Laravel debug mode enabled
- **Auto Dependencies:** Composer dan NPM install otomatis

## Struktur Volume

Development environment menggunakan volume mounting untuk:
- Source code (`./` -> `/app`)
- Storage files (`./storage/` -> `/app/storage/`)
- Cache files (`./bootstrap/cache/` -> `/app/bootstrap/cache/`)

## Environment Variables

Pastikan file `.env` sudah dikonfigurasi dengan benar. Script akan otomatis membuat dari `.env.example` jika belum ada.

Key environment variables untuk Docker:
```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite
```

## Troubleshooting

### Container tidak start
```bash
# Cek logs
./frankenphp.sh logs

# Rebuild container
./frankenphp.sh dev:stop
./frankenphp.sh clean
./frankenphp.sh dev:start
```

### Permission issues
```bash
# Fix storage permissions
./frankenphp.sh exec chmod -R 775 storage bootstrap/cache
./frankenphp.sh exec chown -R www-data:www-data storage bootstrap/cache
```

### Database issues
```bash
# Reset database
./frankenphp.sh exec php artisan migrate:fresh --seed
```

## Optimasi Production

Untuk production, pastikan:
1. Set `APP_ENV=production` dan `APP_DEBUG=false`
2. Run `php artisan optimize` untuk caching config/routes/views
3. Use `docker-compose.yml` instead of `docker-compose.dev.yml`
4. Consider menggunakan database terpisah (MySQL/PostgreSQL)

## Custom Configuration

### Menambah PHP Extensions
Edit `Dockerfile.dev` dan tambahkan di bagian `install-php-extensions`:
```dockerfile
RUN install-php-extensions \
    pdo_mysql \
    pdo_sqlite \
    your-extension-here
```

### Mengubah Caddy Configuration
Edit `Caddyfile` untuk menambah atau mengubah routing, middleware, dll.

### Database Configuration
Uncomment bagian MySQL/Redis di `docker-compose.dev.yml` jika diperlukan dan update `.env` accordingly.
