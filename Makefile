# Laravel Starter Kit - Docker Commands
# Usage: make [command]

.PHONY: help dev prod stop clean restart logs shell migrate seed build install

# Default target
help: ## Show this help message
	@echo "Laravel Starter Kit - Available Commands:"
	@echo "=================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Development Commands
dev: ## Start development environment
	docker compose up -d
	@echo "✅ Development environment started!"
	@echo "🌐 Application: http://localhost:$$(grep APP_PORT .env | cut -d '=' -f2)"
	@echo "📧 Mailpit: http://localhost:$$(grep FORWARD_MAILPIT_DASHBOARD_PORT .env | cut -d '=' -f2)"

dev-build: ## Start development environment with rebuild
	docker compose up -d --build
	@echo "✅ Development environment started with fresh build!"

# Production Commands
prod: ## Start production environment
	docker compose -f docker-compose.prod.yml up -d --build
	@echo "✅ Production environment started!"
	@echo "🌐 Application: http://localhost:8080"

# Control Commands
stop: ## Stop all containers
	docker compose down
	docker compose -f docker-compose.prod.yml down 2>/dev/null || true
	@echo "🛑 All containers stopped"

restart: ## Restart development environment
	make stop
	make dev

clean: ## Clean all Docker resources (containers, volumes, networks)
	docker compose down -v
	docker compose -f docker-compose.prod.yml down -v 2>/dev/null || true
	docker system prune -f
	@echo "🧹 All Docker resources cleaned"

# Application Commands
shell: ## Open shell in Laravel container
	docker compose exec laravel.test bash

key-generate: ## Generate application key
	docker compose exec laravel.test php artisan key:generate

migrate: ## Run database migrations
	docker compose exec laravel.test php artisan migrate --force

seed: ## Seed database
	docker compose exec laravel.test php artisan db:seed

fresh: ## Fresh migrate with seed
	docker compose exec laravel.test php artisan migrate:fresh --seed

# Development Commands
install: ## Install dependencies
	docker compose exec laravel.test composer install
	docker compose exec laravel.test npm install

build: ## Build frontend assets
	docker compose exec laravel.test npm run build

watch: ## Watch frontend assets for changes
	docker compose exec laravel.test npm run dev

# Utility Commands
logs: ## Show container logs
	docker compose logs -f

status: ## Show container status
	docker ps

# Cache Commands
cache-clear: ## Clear all Laravel caches
	docker compose exec laravel.test php artisan cache:clear
	docker compose exec laravel.test php artisan config:clear
	docker compose exec laravel.test php artisan route:clear
	docker compose exec laravel.test php artisan view:clear

cache-optimize: ## Optimize for production
	docker compose exec laravel.test php artisan config:cache
	docker compose exec laravel.test php artisan route:cache
	docker compose exec laravel.test php artisan view:cache

# Quick Setup Commands
setup: ## Complete setup for new installation
	make dev
	sleep 10
	docker compose exec laravel.test php artisan key:generate --force
	make migrate
	make install
	make build
	@echo "🚀 Setup completed! Visit http://localhost:$$(grep APP_PORT .env | cut -d '=' -f2)"

quick-start: ## One command to start everything
	./deploy.sh development
