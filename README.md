# Laravel 12 Spatie Media & Roles StarterKit with Docker

An open-source starter kit built with **Laravel 12** to jumpstart your web development projects. This kit comes packed with powerful features including:

- **Spatie Roles & Permissions** – Robust user access control.
- **Spatie Media Library** – Seamless media management.
- **Dropzone JS** – Modern, user-friendly file uploads.
- **DataTables (from datatables.net)** – Advanced table features with server-side processing and soft delete support.
- **🐳 Docker Support** – Complete containerization with Laravel Sail for development and production.
- **🚀 Production Ready** – Optimized Docker setup with Nginx, Supervisor, and performance optimizations.

Built in just **29 hours over 5 days**, this starter kit is designed to help you hit the ground running!

---

## � Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <your-repo-url>
cd laravel-12-spattie-media-and-roles

# Copy environment file
cp .env.example .env

# One-command setup
make setup

# Access your application
# 🌐 App: http://localhost:8000
# 📧 Mailpit: http://localhost:8026
```

### Option 2: Traditional Setup

```bash
# Clone and install
git clone <your-repo-url>
cd laravel-12-spattie-media-and-roles
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run application
php artisan serve
npm run dev
```

---

## 📚 Documentation

For detailed setup, features, and deployment instructions, see our comprehensive documentation:

- **[🐳 Docker Setup](documentation/docker-setup.md)** - Docker installation and configuration
- **[📦 Traditional Installation](documentation/installation.md)** - Non-Docker setup guide  
- **[✨ Features Guide](documentation/features.md)** - Media Library, DataTables, and Dropzone usage
- **[🐛 Troubleshooting](documentation/troubleshooting.md)** - Common issues and solutions
- **[🚀 Deployment Guide](documentation/deployment.md)** - Production deployment strategies
- **[🔧 Commands Reference](documentation/commands.md)** - All available commands

---

## 🛠️ Quick Commands

```bash
make help           # Show all available commands
make dev            # Start development environment
make stop           # Stop all containers
make restart        # Restart containers
make setup          # Complete setup for new installation
make key-generate   # Generate application key
make migrate        # Run database migrations
make build          # Build frontend assets
make shell          # Access container shell
```

---

## 🌐 Access URLs

### Development Environment
- **Main Application**: http://localhost:8000
- **Mailpit (Email Testing)**: http://localhost:8026  
- **Database**: localhost:3308 (user: sail, password: password)
- **Redis**: localhost:6380

### Production Environment  
- **Main Application**: http://localhost:8080
- **Database**: localhost:3306 (configure in .env.production)

---

## 🔧 Port Configuration

The development environment uses non-conflicting ports:
- **App**: 8000 (instead of default 80)
- **Database**: 3308 (instead of default 3306)
- **Redis**: 6380 (instead of default 6379)  
- **Mailpit**: 8026 (instead of default 8025)

To change the app port:
```bash
# Edit .env
APP_PORT=9000
APP_URL=http://localhost:9000

# Restart containers
make restart
```

---

## 🐛 Common Issues

**Missing APP_KEY error:**
```bash
make key-generate
```

**Port conflicts:**
```bash
make stop
# Edit .env to change ports
make dev
```

**Database connection issues:**
```bash
make restart
```

For more troubleshooting, see [Troubleshooting Guide](documentation/troubleshooting.md).

---

## 📋 What's Included

- **Laravel 12** with latest features
- **Spatie Media Library** for file management
- **Spatie Permissions** for role-based access
- **React + Inertia.js** for modern frontend
- **DataTables** with server-side processing
- **Dropzone JS** for file uploads
- **Docker & Docker Compose** configuration
- **Production-ready setup** with Nginx + Supervisor
- **Comprehensive documentation**

---

## 🚀 Production Deployment

```bash
# Quick production deployment
cp .env.production .env
# Edit .env with your production settings
./deploy.sh production
```

For detailed deployment instructions, see [Deployment Guide](documentation/deployment.md).

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Need help?** Check our [documentation](documentation/) or open an issue on GitHub.
