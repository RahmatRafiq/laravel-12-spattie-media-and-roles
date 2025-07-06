#!/bin/bash

echo "🐘 Laravel Docker Setup - PHP Version Selector"
echo "=============================================="
echo ""

# Function to update docker-compose.yml
update_php_version() {
    local version=$1
    echo "🔄 Updating docker-compose.yml for PHP $version..."
    
    # Update context path in docker-compose.yml
    sed -i "s|context: './docker/8\.[0-9]'|context: './docker/$version'|g" docker-compose.yml
    
    echo "✅ Docker Compose updated for PHP $version"
}

# Show current PHP version
current_version=$(grep "context: './docker/" docker-compose.yml | sed "s/.*docker\/\([0-9]\.[0-9]\).*/\1/")
echo "📋 Current PHP Version: $current_version"
echo ""

echo "Select PHP Version:"
echo "1) PHP 8.2 (Minimum requirement for Laravel 12)"
echo "2) PHP 8.3 (Recommended for production)"  
echo "3) PHP 8.4 (Latest features, recommended for development)"
echo "4) Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        update_php_version "8.2"
        ;;
    2)
        update_php_version "8.3"
        ;;
    3)
        update_php_version "8.4"
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "🚀 Setup complete! Run the following commands to start:"
echo "   docker-compose build"
echo "   docker-compose up -d"
