# Laravel 12 Spatie Media & Roles StarterKit with Docker

An open-source starter kit built with **Laravel 12** to jumpstart your web development projects. This kit comes packed with powerful features including:

- **Spatie Roles & Permissions** – Complete role-based access control with middleware integration
- **Spatie Media Library** – Seamless media management with image processing
- **React + Inertia.js** – Modern SPA experience with server-side rendering capabilities
- **Dropzone JS** – Modern, user-friendly file uploads with progress tracking
- **DataTables (from datatables.net)** – Advanced table features with server-side processing and soft delete support
- **🐳 Docker Support** – Complete containerization with Laravel Sail for development and production
- **🚀 Production Ready** – Optimized Docker setup with Nginx, Supervisor, and performance optimizations
- **🔐 Pre-configured Authentication** – Complete auth system with role-based dashboard access

Built with modern Laravel 12 best practices, this starter kit is designed to help you hit the ground running!

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles.git
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
git clone https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles.git
cd laravel-12-spattie-media-and-roles
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed

# Run application
php artisan serve
npm run dev
```

### 🔐 Default Login Credentials

After running the seeders, you can login with:

**Admin User:**

- Email: `admin@example.com`
- Password: `password`
- Permissions: Full access to all features

**Regular User:**

- Email: `user@example.com`
- Password: `password`
- Permissions: Limited dashboard access

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
# Development Commands
make help           # Show all available commands
make dev            # Start development environment
make stop           # Stop all containers
make restart        # Restart containers
make setup          # Complete setup for new installation

# Laravel Commands
make key-generate   # Generate application key
make migrate        # Run database migrations
make seed           # Run database seeders
make fresh          # Fresh migration with seeding

# Asset Commands
make build          # Build frontend assets for production
make dev-assets     # Build assets for development
make watch          # Watch assets for changes

# Utility Commands
make shell          # Access container shell
make logs           # View container logs
make clear-cache    # Clear all Laravel caches
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

## 🔐 Role & Permission Usage

### Available Roles

- **Admin**: Full system access with all permissions
- **User**: Limited access to dashboard and basic features

### Available Permissions

```php
// User Management
'view-users', 'create-users', 'edit-users', 'delete-users'

// Role Management
'view-roles', 'create-roles', 'edit-roles', 'delete-roles'

// Permission Management
'view-permissions', 'assign-permissions'

// General Access
'view-dashboard', 'access-admin-panel', 'manage-settings', 'view-activity-logs'
```

### Middleware Usage in Routes

```php
// Single permission check
Route::get('/users', [UserController::class, 'index'])
    ->middleware('permission:view-users');

// Multiple permissions (OR logic)
Route::resource('roles', RoleController::class)
    ->middleware('permission:view-roles|create-roles|edit-roles|delete-roles');

// Role-based access
Route::middleware('role:admin')->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});

// Mixed role and permission
Route::get('/admin/settings', [AdminController::class, 'settings'])
    ->middleware('role:admin')
    ->middleware('permission:manage-settings');
```

### Controller Usage

```php
// Check permissions in controller
public function index()
{
    if (!auth()->user()->can('view-users')) {
        abort(403, 'You cannot view users.');
    }

    // Check roles
    if (!auth()->user()->hasRole('admin')) {
        abort(403, 'Admin access required.');
    }
}
```

### Blade/React Usage

```php
// In Blade templates
@can('edit-users')
    <button>Edit User</button>
@endcan

@role('admin')
    <a href="/admin">Admin Panel</a>
@endrole
```

```tsx
// In React components (passed from backend)
{
    user.permissions.includes('edit-users') && <button>Edit User</button>;
}

{
    user.roles.includes('admin') && <Link href="/admin">Admin Panel</Link>;
}
```

---

## 📋 What's Included

### 🔐 Role & Permission System

- **2 Pre-configured Roles**: Admin and User
- **14 Granular Permissions**: User management, role management, dashboard access, etc.
- **Middleware Integration**: Route-level permission checking
- **Flexible Access Control**: Role-based and permission-based restrictions

### 🛠️ Technical Stack

- **Laravel 12** with latest features and best practices
- **Spatie Media Library** for advanced file management
- **Spatie Permissions** for role-based access control
- **React + Inertia.js** for modern SPA experience
- **TypeScript** for type-safe frontend development
- **Tailwind CSS** for utility-first styling
- **DataTables** with server-side processing and advanced features
- **Dropzone JS** for drag-and-drop file uploads

### 🐳 DevOps & Deployment

- **Docker & Docker Compose** for containerization
- **Laravel Sail** for development environment
- **Production-ready setup** with Nginx + Supervisor
- **Redis** for caching and session management
- **Mailpit** for email testing in development

### 📊 Database & Seeders

- **Pre-configured migrations** for roles, permissions, and users
- **Smart seeders** with realistic test data
- **Soft delete support** throughout the application
- **Activity logging** with Spatie ActivityLog

### 🎨 Frontend Features

- **Responsive design** that works on all devices
- **Dark/Light theme** support
- **Modern UI components** with shadcn/ui
- **Error handling** with custom 403 pages
- **Loading states** and user feedback

---

## 🚀 Production Deployment

### Quick Production Setup

```bash
# Clone and prepare for production
git clone https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles.git
cd laravel-12-spattie-media-and-roles

# Setup production environment
cp .env.production .env
# Edit .env with your production database and app settings

# Deploy with Docker
./deploy.sh production

# Or deploy traditionally
composer install --optimize-autoloader --no-dev
npm run build
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables for Production

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Redis for sessions and cache
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password

# Mail configuration
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
```

For detailed deployment instructions, see [Deployment Guide](documentation/deployment.md).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests (`make test`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

---

## 🌟 Features Roadmap

- [ ] **API Documentation** with Swagger/OpenAPI
- [ ] **Multi-language Support** with Laravel Localization
- [ ] **Advanced Media Management** with image processing pipelines
- [ ] **Real-time Notifications** with Laravel Reverb
- [ ] **Advanced User Management** with profile customization
- [ ] **Audit Trail** with detailed activity logging
- [ ] **Export/Import** functionality for data management
- [ ] **Two-Factor Authentication** for enhanced security

---

## 📞 Support

- **Documentation**: Check our [comprehensive docs](documentation/)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles/discussions)

---

**⭐ Star this repository if you find it helpful!**

Built with ❤️ using Laravel 12, React, and modern web technologies.
