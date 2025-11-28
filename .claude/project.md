# Laravel 12 Spatie Media & Roles StarterKit

## 📋 Project Overview

Ini adalah **Laravel 12 Professional Starter Kit** yang dibangun dengan fokus pada:
- Manajemen Media/File menggunakan Spatie Media Library
- Role & Permission System menggunakan Spatie Permissions
- Dashboard Admin Modern dengan React + TypeScript + Inertia.js
- Real-time Activity Logging dengan Laravel Reverb (WebSocket)

Proyek ini adalah **foundation/base project** yang siap production untuk membangun berbagai jenis aplikasi web seperti CMS, Admin Panel, SaaS, atau E-commerce.

---

## 🏗️ Tech Stack

### Backend
- **Laravel 12.x** - PHP Framework (Latest)
- **PHP 8.2+** - Programming Language
- **Inertia.js 2.0** - Server-Side Rendering bridge
- **Spatie Media Library 11.12** - File/Media management
- **Spatie Permission 6.16** - RBAC (Role-Based Access Control)
- **Spatie Activity Log 4.10** - Audit trail & activity logging
- **Laravel Reverb 1.4** - WebSocket server untuk real-time features
- **MariaDB 11** - Database
- **Redis** - Cache & Queue

### Frontend
- **React 19.0** - UI Library (Latest)
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Tailwind CSS 4.0** - Utility-first CSS framework (Latest)
- **Vite 6.0** - Build tool modern
- **shadcn/ui** - Component library berbasis Radix UI
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library (200+ icons)
- **DataTables.net** - Server-side table processing
- **DnD Kit** - Drag & drop functionality
- **Dropzone 6.0** - File upload interface
- **Laravel Echo** - WebSocket client

### Development Tools
- **Docker + FrankenPHP** - Containerization
- **Laravel Pint** - PHP code formatter
- **ESLint + Prettier** - JS/TS formatter
- **Pest** - Testing framework

---

## 🎯 Key Features

### 1. Authentication & Authorization
- ✅ Login/Register (Laravel Breeze)
- ✅ Social Login (Google, Facebook via Socialite)
- ✅ Email Verification & Password Reset
- ✅ Role-based Access Control (Admin, User)
- ✅ 14 Pre-defined Permissions
- ✅ Middleware Protection

### 2. User Management
- ✅ CRUD User lengkap dengan DataTables
- ✅ **Soft Delete** (hapus sementara)
- ✅ **Restore User** (kembalikan user yang dihapus)
- ✅ **Force Delete** (hapus permanen)
- ✅ Filter: Active / Trashed / All
- ✅ Server-side DataTables processing
- ✅ Profile management + avatar upload

### 3. Dynamic Menu System ⭐
- ✅ **Drag & drop** reordering dengan DnD Kit
- ✅ **Nested menu** (parent-child unlimited level)
- ✅ Icon picker dari Lucide (200+ icons)
- ✅ Route assignment ke Laravel routes
- ✅ **Permission-based visibility** (menu muncul sesuai permission user)
- ✅ Tree visualization
- ✅ Database-driven (tidak hardcoded)

### 4. Gallery/File Manager ⭐
- ✅ Upload files dengan drag & drop
- ✅ **Folder management** (create, rename, delete, nested)
- ✅ Breadcrumb navigation
- ✅ Public/Private file storage
- ✅ Collection-based organization
- ✅ Spatie Media Library integration
- ✅ Image preview & pagination

### 5. Real-time Activity Logging ⭐
- ✅ **Auto-logging** semua perubahan User model
- ✅ **Real-time broadcasting** via WebSocket (Laravel Reverb)
- ✅ Live monitoring dengan connection status
- ✅ Before/after values comparison
- ✅ User attribution
- ✅ Color-coded events

### 6. App Settings
- ✅ Global configuration (name, logo, favicon)
- ✅ SEO Settings (title, description, keywords, OG image)
- ✅ Theme Colors (10 pilihan dengan Tailwind mapping)
- ✅ Contact Info & Social Links
- ✅ Maintenance Mode
- ✅ Singleton pattern

### 7. Dark Mode
- ✅ Light/Dark/System mode
- ✅ Cookie + localStorage persistence
- ✅ SSR support
- ✅ OKLCH color system

---

## 📁 Important File Structure

### Backend (Laravel)

```
app/
├── Models/
│   ├── User.php                    # HasRoles, HasMedia, LogsActivity, SoftDeletes
│   ├── Role.php                    # Spatie Role model
│   ├── Permission.php              # Spatie Permission model
│   ├── Menu.php                    # Dynamic menu (nested)
│   ├── Gallery.php                 # File/media model
│   ├── AppSetting.php              # Global settings (singleton)
│   └── FilemanagerFolder.php       # Gallery folder structure
│
├── Http/Controllers/
│   ├── MenuController.php          # Menu CRUD + drag & drop reorder
│   ├── GalleryController.php       # File manager operations
│   ├── ActivityLogController.php   # Activity logs + real-time
│   ├── AppSettingController.php    # App settings CRUD
│   ├── UserRolePermission/
│   │   ├── UserController.php      # User CRUD (soft delete)
│   │   ├── RoleController.php      # Role CRUD
│   │   └── PermissionController.php # Permission CRUD
│   └── Auth/                       # Laravel Breeze
│
├── Events/
│   └── ActivityLogCreated.php      # WebSocket broadcast event
│
├── Helpers/
│   ├── DataTable.php               # Server-side DataTables helper
│   ├── MediaLibrary.php            # File operations helper
│   └── Guards.php                  # Auth guards helper
│
└── Providers/
    └── AppServiceProvider.php      # Share menus & settings to Inertia
```

### Frontend (React/TypeScript)

```
resources/js/
├── components/
│   ├── app-sidebar.tsx             # Sidebar dengan dynamic menu dari DB
│   ├── app-header.tsx              # Application header
│   ├── datatables.tsx              # DataTable wrapper + confirmation
│   ├── TreeDnD.tsx                 # Generic drag & drop tree
│   ├── dropzoner.tsx               # File upload component
│   ├── confirmation-dialog.tsx     # Reusable confirmation dialog
│   ├── page-container.tsx          # Page wrapper (padding & max-width)
│   ├── page-section.tsx            # Section layout dengan sidebar
│   ├── select.tsx                  # Custom react-select wrapper
│   └── ui/                         # 24 shadcn/ui components
│
├── pages/
│   ├── dashboard.tsx               # Main dashboard
│   ├── ActivityLogList.tsx         # Real-time activity logs
│   ├── Gallery/                    # File manager (6 components)
│   ├── Menu/                       # Menu management (Index, Form)
│   ├── UserRolePermission/         # User/Role/Permission (6 pages)
│   ├── AppSetting/                 # Global settings
│   ├── auth/                       # 6 authentication pages
│   └── settings/                   # Profile, Password, Appearance
│
├── layouts/
│   ├── app-layout.tsx              # Main layout dengan sidebar
│   ├── auth-layout.tsx             # Auth layout wrapper
│   ├── settings/layout.tsx         # Settings page layout
│   └── UserRolePermission/layout.tsx # URP layout
│
├── hooks/
│   ├── use-appearance.tsx          # Dark mode management
│   ├── use-confirmation.ts         # Confirmation dialog state
│   ├── use-mobile.tsx              # Responsive detection
│   └── useMenus.ts                 # Fetch dynamic menus
│
└── types/
    ├── index.d.ts                  # Main TypeScript definitions
    ├── DataTables.d.ts             # DataTables types
    ├── FileManager.d.ts            # File manager types
    └── UserRolePermission.d.ts     # URP types
```

---

## 🎨 UI Component System

### Available shadcn/ui Components (24 total)
- **Forms:** Button, Input, Label, Textarea, Checkbox, Select
- **Overlays:** Dialog, Alert Dialog, Dropdown Menu, Sheet, Tooltip
- **Navigation:** Breadcrumb, Navigation Menu, Sidebar
- **Feedback:** Alert, Badge, Skeleton
- **Data Display:** Avatar, Card, Separator, Table
- **Interactions:** Toggle, Toggle Group, Collapsible

### Custom High-Value Components
1. **DataTableWrapper** - Server-side DataTables dengan confirmation dialogs
2. **TreeDnD** - Generic drag & drop tree untuk nested structures
3. **Dropzoner** - File upload dengan preview
4. **ConfirmationDialog** - Reusable dialog dengan variants
5. **PageContainer** - Consistent page padding & max-width
6. **PageSection** - Layout untuk pages dengan sidebar

### Color System (OKLCH)
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... 20+ semantic colors */
}
```

---

## 🔑 Important Models & Relationships

### User Model
```php
// Traits
use HasFactory, HasRoles, InteractsWithMedia, LogsActivity, Notifiable, SoftDeletes;

// Relations
roles()         // BelongsToMany Role
permissions()   // BelongsToMany Permission
media()         // MorphMany Media

// Features
- Social login support (provider, provider_id)
- Soft delete
- Activity logging (auto-track changes)
- Media collections: 'profile_image'
```

### Menu Model
```php
// Structure
title: string           // Menu title
route: string|null      // Laravel route name
icon: string|null       // Lucide icon name
permission: string|null // Required permission to view
parent_id: int|null     // Parent menu ID (nested)
order: int              // Display order

// Relations
parent()    // BelongsTo Menu (self-referencing)
children()  // HasMany Menu (ordered by order)

// Features
- Unlimited nested levels
- Permission-based visibility
- Drag & drop reordering
```

### Gallery/Media
```php
// Spatie Media Library
- Collections: 'gallery', 'attachments'
- Custom properties: 'visibility', 'folder_id'
- Disks: 'public' (images), 'local' (private files)
```

---

## 🛠️ Common Development Patterns

### 1. Creating New Pages

**Backend (Controller):**
```php
public function index()
{
    return Inertia::render('YourPage/Index', [
        'data' => YourModel::all(),
        'success' => session('success'),
    ]);
}
```

**Frontend (React):**
```tsx
import AppLayout from '@/layouts/app-layout';
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';
import { Head } from '@inertiajs/react';

export default function YourPage({ data }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Your Page" />
            <PageContainer maxWidth="4xl">
                <Heading title="Your Page" description="Description here" />
                {/* Your content */}
            </PageContainer>
        </AppLayout>
    );
}
```

### 2. DataTables Pattern

**Controller:**
```php
public function json(Request $request)
{
    return DataTable::of(YourModel::query())
        ->make(true);
}
```

**Frontend:**
```tsx
<DataTableWrapper
    ref={tableRef}
    ajax={{
        url: route('your.json'),
        type: 'GET',
    }}
    columns={columns}
/>
```

### 3. Permission-Based UI Hiding

**Backend Route:**
```php
Route::middleware('permission:view-users')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});
```

**Frontend:**
```tsx
{user.permissions.includes('create-users') && (
    <Button>Create User</Button>
)}
```

### 4. Confirmation Dialog Pattern

```tsx
import { useConfirmation } from '@/hooks/use-confirmation';
import ConfirmationDialog from '@/components/confirmation-dialog';

const { confirmationState, handleConfirm, handleCancel, openConfirmation } = useConfirmation();

// Trigger
openConfirmation({
    title: 'Delete User?',
    message: 'This action cannot be undone.',
    onConfirm: () => router.delete(route('users.destroy', user.id)),
});

// Render
<ConfirmationDialog state={confirmationState} onConfirm={handleConfirm} onCancel={handleCancel} />
```

### 5. Form Submission Pattern

```tsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
});

const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('users.store'), {
        onSuccess: () => toast.success('User created!'),
    });
};
```

---

## 🚀 Common Commands

### Development
```bash
# Start development server (concurrent)
composer dev

# Individual services
php artisan serve
php artisan queue:listen
php artisan reverb:start
npm run dev

# Docker
composer docker:dev

# Format code
composer pint           # PHP formatting
npm run format          # JS/TS formatting
```

### Database
```bash
# Fresh migration + seed
php artisan migrate:fresh --seed

# Create migration
php artisan make:migration create_your_table

# Create model
php artisan make:model YourModel -mcr
```

### Inertia/React
```bash
# Build for production
npm run build

# Type checking
npm run type-check

# Lint
npm run lint
```

### Broadcasting/Queue
```bash
# Start Reverb WebSocket server
php artisan reverb:start

# Queue worker
php artisan queue:listen

# Clear cache
php artisan optimize:clear
```

---

## 🔐 Permissions List

### User Management
- `view-users` - View user list
- `create-users` - Create new users
- `edit-users` - Edit existing users
- `delete-users` - Delete users

### Role Management
- `view-roles` - View role list
- `create-roles` - Create new roles
- `edit-roles` - Edit existing roles
- `delete-roles` - Delete roles

### Permission Management
- `view-permissions` - View permission list
- `assign-permissions` - Assign permissions to roles

### General
- `view-dashboard` - Access dashboard
- `manage-settings` - Manage app settings
- `view-activity-logs` - View activity logs
- `manage-menus` - Manage dynamic menus (if needed)

---

## 📝 Important Notes

### Real-time Features
- **Laravel Reverb** runs on port 8080 by default
- **Private channels** require authentication
- **Echo configuration** di `resources/js/echo.js`
- **Broadcasting events** automatically via `ActivityLogCreated` event

### File Upload
- **Public files** → `storage/app/public` (symlinked to `public/storage`)
- **Private files** → `storage/app/private`
- **Access private files** → Route with auth middleware
- **Spatie Media** handles conversions & optimizations

### Menu System
- Menus loaded via `AppServiceProvider` dan shared ke semua Inertia pages
- Permission-based filtering di backend (security)
- Icon names dari Lucide: `Home`, `Users`, `Settings`, dll
- Order dapat diubah via drag & drop, auto-save

### Styling
- **Tailwind CSS 4.0** dengan JIT compiler
- **OKLCH color space** untuk modern color management
- **Dark mode** via `.dark` class pada `<html>`
- **CSS variables** untuk semantic colors

### TypeScript
- **Strict mode** enabled
- **Types** defined di `resources/js/types/`
- **Ziggy** types auto-generated untuk routes
- **Inertia** types untuk page props

---

## 🐛 Common Issues & Solutions

### 1. WebSocket Connection Failed
```bash
# Check if Reverb is running
php artisan reverb:start

# Check .env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
```

### 2. File Upload Not Working
```bash
# Create storage link
php artisan storage:link

# Check permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 3. Vite Not Loading
```bash
# Clear cache
npm run build
php artisan optimize:clear

# Check .env
APP_URL=http://localhost
ASSET_URL=http://localhost
```

### 4. Permission Denied
```bash
# Clear permission cache
php artisan permission:cache-reset
php artisan cache:clear
```

---

## 🎯 Design Principles

### Backend
1. **Single Responsibility** - Each controller handles one resource
2. **DRY (Don't Repeat Yourself)** - Use helpers for reusable logic
3. **Security First** - Middleware protection, permission checks
4. **Type Safety** - PHP 8.2 types everywhere
5. **Clean Code** - Laravel Pint formatting

### Frontend
1. **Component Composition** - Small, reusable components
2. **Type Safety** - TypeScript strict mode
3. **Accessibility** - ARIA labels, keyboard navigation
4. **Performance** - Code splitting, lazy loading
5. **Consistency** - Design system via shadcn/ui

### Database
1. **Normalization** - Proper table relationships
2. **Indexing** - Foreign keys, search columns
3. **Soft Deletes** - Keep data integrity
4. **Migrations** - Version control for schema

---

## 📚 Useful Resources

### Documentation
- [Laravel Docs](https://laravel.com/docs/12.x)
- [Inertia.js Docs](https://inertiajs.com)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Spatie Media Library](https://spatie.be/docs/laravel-medialibrary)
- [Spatie Permission](https://spatie.be/docs/laravel-permission)

### Project Structure
- Main entry: `resources/js/app.tsx`
- Routes: `routes/web.php`
- Shared data: `app/Providers/AppServiceProvider.php`
- Types: `resources/js/types/index.d.ts`

---

## 🎉 Quick Start Guide

1. **Clone & Install**
```bash
composer install
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database**
```bash
php artisan migrate:fresh --seed
```

4. **Storage Link**
```bash
php artisan storage:link
```

5. **Run Development**
```bash
composer dev
```

6. **Login**
- Admin: `admin@example.com` / `password`
- User: `user@example.com` / `password`

---

## 📊 Project Statistics

- **Models:** 7
- **Controllers:** 12+
- **React Pages:** 20+
- **Custom Components:** 15+
- **shadcn/ui Components:** 24
- **Hooks:** 5
- **Layouts:** 5
- **Permissions:** 14
- **Seeders:** 6

---

## 🔄 Development Workflow

1. **Planning:** Review requirements
2. **Backend:** Create migrations, models, controllers
3. **Frontend:** Create pages, components
4. **Testing:** Manual testing + automated tests
5. **Code Quality:** Run Pint + ESLint
6. **Commit:** Git commit with conventional commits
7. **Deploy:** Build + migrate + optimize

---

**Last Updated:** 2025-11-29
**Laravel Version:** 12.x
**React Version:** 19.0
**TypeScript Version:** 5.7.2
