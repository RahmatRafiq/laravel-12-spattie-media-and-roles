#!/bin/bash

# Laravel Starter Kit Deployment Script
# Usage: ./deploy.sh [development|production]

set -e

ENVIRONMENT=${1:-development}

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to deploy development environment
deploy_development() {
    echo "📦 Setting up development environment..."
    
    # Stop any existing containers
    echo "🛑 Stopping existing containers..."
    ./vendor/bin/sail down 2>/dev/null || true
    
    # Build and start containers
    echo "🔨 Building and starting containers..."
    ./vendor/bin/sail up -d --build
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    # Install dependencies if needed
    if [ ! -d "vendor" ] || [ ! -d "node_modules" ]; then
        echo "📥 Installing dependencies..."
        ./vendor/bin/sail composer install
        ./vendor/bin/sail npm install
    fi
    
    # Run migrations and seed database
    echo "🗃️  Running database migrations..."
    ./vendor/bin/sail artisan migrate --force
    
    # Build frontend assets
    echo "🎨 Building frontend assets..."
    ./vendor/bin/sail npm run build
    
    # Clear and cache config
    echo "⚙️  Optimizing application..."
    ./vendor/bin/sail artisan config:clear
    ./vendor/bin/sail artisan cache:clear
    ./vendor/bin/sail artisan route:clear
    ./vendor/bin/sail artisan view:clear
    
    echo "✅ Development environment is ready!"
    echo "🌐 Application: http://localhost:8000"
    echo "📧 Mailpit: http://localhost:8026"
    echo "💾 Database: localhost:3308"
}

# Function to deploy production environment
deploy_production() {
    echo "🏭 Setting up production environment..."
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        echo "❌ .env.production file not found. Please create it first."
        exit 1
    fi
    
    # Copy production environment
    echo "⚙️  Setting production environment..."
    cp .env.production .env
    
    # Stop any existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # Build production image
    echo "🔨 Building production image..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Start production containers
    echo "🚀 Starting production containers..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 20
    
    # Run production optimizations
    echo "⚡ Running production optimizations..."
    docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
    docker-compose -f docker-compose.prod.yml exec app php artisan config:cache
    docker-compose -f docker-compose.prod.yml exec app php artisan route:cache
    docker-compose -f docker-compose.prod.yml exec app php artisan view:cache
    
    echo "✅ Production environment is ready!"
    echo "🌐 Application: http://localhost:8080"
}

# Function to show help
show_help() {
    echo "Laravel Starter Kit Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [ENVIRONMENT]"
    echo ""
    echo "ENVIRONMENT:"
    echo "  development  Deploy development environment with Laravel Sail (default)"
    echo "  production   Deploy production environment with optimized Docker setup"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh              # Deploy development environment"
    echo "  ./deploy.sh development  # Deploy development environment"
    echo "  ./deploy.sh production   # Deploy production environment"
}

# Main execution
case $ENVIRONMENT in
    development)
        check_docker
        deploy_development
        ;;
    production)
        check_docker
        deploy_production
        ;;
    help)
        show_help
        ;;
    *)
        echo "❌ Invalid environment: $ENVIRONMENT"
        echo "Use 'development', 'production', or 'help'"
        exit 1
        ;;
esac
