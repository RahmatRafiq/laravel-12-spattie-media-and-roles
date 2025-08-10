# Laravel 12 Spatie Media & Roles StarterKit [![wakatime](https://wakatime.com/badge/github/RahmatRafiq/laravel-12-spattie-media-and-roles.svg)](https://wakatime.com/badge/github/RahmatRafiq/laravel-12-spattie-media-and-roles)

A modern starter kit for web apps using **Laravel 12**, **React 19 + Inertia.js**, **Spatie Roles & Permissions**, and **Spatie Media Library**. Built for maintainability, modularity, and rapid development.

## Features

- Role & Permission system (Spatie)
- Media management (Spatie Media Library)
- Menu management (drag & drop, nested, permission-aware)
- Gallery management (upload, organize, delete)
- App settings (admin configurable)
- User authentication (pre-configured, role-based dashboard)
- DataTables (server-side, soft delete)
- Responsive UI (Tailwind CSS, shadcn/ui, dark/light mode)
- Modular React components (Button, ConfirmationDialog, TreeDnD, Sidebar, etc.)
- Activity logging (Spatie ActivityLog)

## Quick Start

```bash
git clone https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles.git
cd laravel-12-spattie-media-and-roles
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
npm run dev
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

## Tech Stack

- Laravel 12, React 19, Inertia.js, TypeScript, Tailwind CSS 4
- Spatie Media Library, Spatie Permissions
- DataTables, Dropzone.js

## Dev & Deployment

- Makefile for quick commands
- Redis, Mailpit for local development

## Database & Seeders

- Migrations and seeders for roles, permissions, users, menus, galleries, etc.

## Frontend

- Responsive, dark/light mode, modular UI, error handling, loading states

## License

MIT License

---

## Support

**Star this repo if you find it useful!**
