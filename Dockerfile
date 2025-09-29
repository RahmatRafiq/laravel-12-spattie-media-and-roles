# Use FrankenPHP official image
FROM dunglas/frankenphp:1.3-php8.4

# Install required PHP extensions for Laravel
RUN install-php-extensions \
    pdo_mysql \
    gd \
    bcmath \
    exif \
    pcntl \
    intl \
    opcache \
    redis \
    zip

# Copy Laravel app code
WORKDIR /var/www/html
COPY . .

# Expose FrankenPHP port
EXPOSE 8000

# Run FrankenPHP with Laravel’s public directory
CMD ["php", "bin/frankenphp", "run", "--root=/var/www/html/public", "--workers=4", "--addr=0.0.0.0:8000"]
