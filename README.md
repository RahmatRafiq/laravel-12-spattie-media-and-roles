# Laravel 12 Spatie Media & Roles StarterKit [![wakatime](https://wakatime.com/badge/github/RahmatRafiq/laravel-12-spattie-media-and-roles.svg)](https://wakatime.com/badge/github/RahmatRafiq/laravel-12-spattie-media-and-roles)

A modern, production-ready starter kit for web apps using **Laravel 12**, **React 19 + Inertia.js**, **Spatie Roles & Permissions**, and **Spatie Media Library**. Built for maintainability, modularity, and rapid development.

> 🤖 **For AI Assistants (Claude Code, Cursor, etc.):** See [`CLAUDE.md`](CLAUDE.md) for quick reference or [`.claude/project.md`](.claude/project.md) for full documentation.

## ✨ Key Features

### 🔐 Authentication & Authorization
- Complete auth system (Laravel Breeze)
- Social login support (Google, Facebook via Socialite)
- Role & Permission management (Spatie Permission)
- 14 pre-defined permissions
- Middleware & UI-based protection

### 📁 File & Media Management
- Advanced file manager dengan folder structure
- Public & private file storage
- Drag & drop upload (Dropzone)
- Image preview & pagination
- Spatie Media Library integration

### 🎯 Dynamic Menu System
- **Database-driven** navigation (tidak hardcoded)
- **Drag & drop** reordering dengan visual feedback
- **Nested/hierarchical** menu (unlimited levels)
- **Permission-based** visibility
- Icon picker (200+ Lucide icons)

### 📊 Activity Logging (Real-time)
- **Live activity monitoring** via WebSocket (Laravel Reverb)
- Auto-track model changes (created, updated, deleted)
- Before/after comparison
- User attribution
- Connection status indicator

### 👥 User Management
- CRUD operations dengan DataTables
- **Soft delete** & **restore** functionality
- Force delete option
- Filter: Active / Trashed / All
- Profile management dengan avatar upload

### ⚙️ App Settings
- Global configuration panel
- SEO settings (meta tags, OG image)
- Theme color customization (10 presets)
- Contact info & social links
- Maintenance mode
- Singleton pattern

### 🎨 Modern UI/UX
- **shadcn/ui** component library (24 components)
- **Dark/Light mode** (system preference support)
- Responsive design (mobile-first)
- OKLCH color system
- Tailwind CSS 4.0
- Smooth animations & transitions

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer 2.x
- Node.js 18+ & npm
- MariaDB/MySQL or PostgreSQL
- Redis (optional, for cache & queue)

### Installation

```bash
# Clone repository
git clone https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles.git
cd laravel-12-spattie-media-and-roles

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate:fresh --seed

# Create storage symlink
php artisan storage:link

# Start development servers (concurrent)
composer dev

# OR start individually
php artisan serve              # Laravel dev server
php artisan queue:listen       # Queue worker
php artisan reverb:start       # WebSocket server
npm run dev                    # Vite dev server
```

### Default Login

- **Admin**

    - Email: `admin@example.com`
    - Password: `password`

- **User**
    - Email: `user@example.com`
    - Password: `password`

---

### Useful Commands

See the `Makefile` for all available commands (setup, migrate, seed, build, dev, logs, etc).

---

**App:** http://localhost:8000  
**Mailpit:** http://localhost:8026  
**Database:** localhost:3308 (user: sail, password: password)  
**Redis:** localhost:6380

---

To change the app port, edit `.env` (`APP_PORT`, `APP_URL`) and restart.

---

## Role & Permission Usage

**Roles:**

- Admin (full access)
- User (limited access)

**Permissions:**
`view-users`, `create-users`, `edit-users`, `delete-users`, `view-roles`, `create-roles`, `edit-roles`, `delete-roles`, `view-permissions`, `assign-permissions`, `view-dashboard`, `access-admin-panel`, `manage-settings`, `view-activity-logs`

**Example route protection:**

```php
Route::resource('roles', RoleController::class)
    ->middleware('permission:view-roles|create-roles|edit-roles|delete-roles');
Route::middleware('role:admin')->group(function () {
    Route::get('menus/manage', [MenuController::class, 'manage']);
});
```

---

## What's Included

- Pre-configured roles & permissions
- Menu management (drag & drop, nested, permission-aware)
- Gallery management
- App settings
- Modular React UI
- Activity logging

## 🛠️ Tech Stack

### Backend
- **Laravel 12.x** - PHP Framework
- **Inertia.js 2.0** - Modern monolith approach
- **Spatie Media Library 11** - File management
- **Spatie Permission 6** - RBAC system
- **Spatie Activity Log 4** - Audit trail
- **Laravel Reverb 1.4** - WebSocket server
- **MariaDB 11** - Database
- **Redis** - Cache & Queue

### Frontend
- **React 19.0** - UI Library
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 4.0** - Styling
- **Vite 6.0** - Build tool
- **shadcn/ui** - Component library
- **Radix UI** - Headless primitives
- **Lucide React** - Icons
- **DataTables.net** - Server-side tables
- **DnD Kit** - Drag & drop
- **Dropzone** - File uploads

### Development
- **Docker + FrankenPHP** - Containerization
- **Laravel Pint** - PHP formatter
- **ESLint + Prettier** - JS/TS formatter
- **Pest** - Testing framework

## 📊 Project Structure

```
├── app/
│   ├── Models/              # Eloquent models
│   ├── Http/Controllers/    # Controllers
│   ├── Events/              # Broadcasting events
│   └── Helpers/             # Helper classes
├── resources/js/
│   ├── components/          # React components
│   ├── pages/               # Inertia pages
│   ├── layouts/             # Layout components
│   ├── hooks/               # Custom hooks
│   └── types/               # TypeScript definitions
├── routes/
│   └── web.php              # Routes
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── .claude/                 # AI assistant docs
│   └── project.md           # Full project documentation
├── CLAUDE.md                # Quick reference for AI
└── README.md                # This file
```

## 📚 Documentation

- **Quick Reference:** [`CLAUDE.md`](CLAUDE.md) - For AI assistants and quick lookup
- **Full Documentation:** [`.claude/project.md`](.claude/project.md) - Complete architecture, patterns, and guides
- **Laravel Docs:** [laravel.com/docs/12.x](https://laravel.com/docs/12.x)
- **Inertia.js Docs:** [inertiajs.com](https://inertiajs.com)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)

## License

MIT License

## 🧪 Testing

```bash
# Run tests
php artisan test

# Run tests with coverage
php artisan test --coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚢 Deployment

```bash
# Build for production
npm run build

# Optimize Laravel
composer deploy:prod

# This runs:
# - php artisan optimize
# - php artisan config:cache
# - php artisan route:cache
# - php artisan view:cache
# - php artisan migrate --force
```

## 🐳 Docker Support

```bash
# Start with Docker Compose
docker-compose up -d

# Start with Laravel Sail
./vendor/bin/sail up -d

# Using composer alias
composer docker:dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Run formatters (`composer pint && npm run format`)
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for changes between versions.

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP Framework
- [Spatie](https://spatie.be) - Media Library, Permission, Activity Log
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Radix UI](https://radix-ui.com) - Headless UI primitives
- [Lucide](https://lucide.dev) - Icon library

---

## 💖 Support

**Star this repo if you find it useful!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/RahmatRafiq/laravel-12-spattie-media-and-roles?style=social)](https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles)
