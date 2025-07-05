# 📦 Traditional Installation Guide

If you prefer not to use Docker, follow this traditional installation:

## Requirements

- PHP >= 8.0  
- Composer  
- Node.js & npm  
- A database (MySQL, PostgreSQL, etc.)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles.git
cd laravel-12-spattie-media-and-roles
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

Then, update your `.env` file with your database and other configuration settings.

### 5. Generate Application Key

```bash
php artisan key:generate
```

## Database Setup & Seeders

### 1. Run Migrations

Migrate the database tables:

```bash
php artisan migrate
```

### 2. Run Seeders (Optional)

If you have seeders configured for roles, permissions, or test data, run:

```bash
php artisan db:seed
```

Note: Ensure your seeders are correctly configured to populate roles, permissions, and any necessary data.

## Running the Application

### 1. Start the Laravel Development Server

```bash
php artisan serve
```

Then open your browser and navigate to http://localhost:8000.

### 2. Compile Assets During Development

For asset compilation and live-reloading during development, run:

```bash
npm run dev
```

## Production Deployment

### 1. Optimize for Production

```bash
# Install dependencies (production only)
composer install --optimize-autoloader --no-dev

# Build assets for production
npm run build

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Web Server Configuration

Configure your web server (Apache/Nginx) to point to the `public` directory of your Laravel application.

#### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
