# 🤖 Claude Code - Project Guide

> **Dokumentasi lengkap untuk AI Assistant (Claude Code, Cursor, dll)**

## 🎯 Apa Proyek Ini?

**Laravel 12 Spatie Media & Roles StarterKit** - Professional starter kit dengan:
- Laravel 12 + React 19 + TypeScript + Inertia.js
- Spatie Media Library (file management)
- Spatie Permission (RBAC)
- Real-time Activity Logging (WebSocket)
- Modern UI dengan shadcn/ui + Tailwind CSS 4.0

📖 **Dokumentasi Lengkap:** `.claude/project.md`

---

## ⚡ Quick Reference

### Tech Stack
```
Backend:  Laravel 12 + Spatie (Media, Permission, Activity Log) + Laravel Reverb
Frontend: React 19 + TypeScript 5.7 + Inertia.js 2.0 + Tailwind CSS 4.0
UI:       shadcn/ui (24 components) + Radix UI + Lucide Icons
Tools:    Vite 6 + Docker + FrankenPHP + Pest
```

### Key Features
- ✅ Dynamic Menu System (drag & drop, nested, permission-based)
- ✅ Real-time Activity Logging (WebSocket)
- ✅ Advanced File Manager (folders, public/private)
- ✅ Complete RBAC (Role & Permission)
- ✅ User Management (soft delete, restore)
- ✅ Dark Mode (light/dark/system)
- ✅ Social Login (Socialite)

---

## 📁 Critical Files

### Entry Points
- **Backend:** `app/Providers/AppServiceProvider.php` (shared Inertia data)
- **Frontend:** `resources/js/app.tsx` (React entry)
- **Routes:** `routes/web.php`
- **Types:** `resources/js/types/index.d.ts`

### Important Models
```
app/Models/
├── User.php          → HasRoles, HasMedia, LogsActivity, SoftDeletes
├── Menu.php          → Dynamic menu (nested, permission-based)
├── AppSetting.php    → Singleton global settings
└── Gallery.php       → File/media management
```

### Key Components
```
resources/js/components/
├── app-sidebar.tsx       → Dynamic menu dari database
├── datatables.tsx        → Server-side DataTables + confirmations
├── TreeDnD.tsx           → Drag & drop tree (generic)
├── page-container.tsx    → Page wrapper (padding & max-width)
└── ui/                   → 24 shadcn/ui components
```

---

## 🎨 UI Component Usage

### Page Layout Pattern
```tsx
import AppLayout from '@/layouts/app-layout';
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';

export default function YourPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Your Page" />
            <PageContainer maxWidth="4xl">
                <Heading title="Title" description="Description" />
                {/* Content */}
            </PageContainer>
        </AppLayout>
    );
}
```

### PageContainer Max Widths
- `'none'` or `'full'` → Full width (datatables)
- `'2xl'` → Simple forms
- `'4xl'` → Complex forms with sections
- `'7xl'` → Gallery/grid layouts

### Available shadcn/ui Components
Button, Input, Label, Textarea, Checkbox, Select, Card, Alert, Badge, Avatar, Dialog, Alert Dialog, Dropdown Menu, Sheet, Breadcrumb, Sidebar, Separator, Skeleton, Toggle, Tooltip, Collapsible, Table, Navigation Menu, Toggle Group

---

## 🔑 Permission System

### 18 Permissions Available
```
User:         view-users, create-users, edit-users, delete-users
Role:         view-roles, create-roles, edit-roles, delete-roles
Permission:   view-permissions, assign-permissions
File Manager: view-gallery, upload-files, delete-files, manage-folders
General:      view-dashboard, manage-settings, view-activity-logs, manage-menus
```

### Usage Pattern
**Backend Route:**
```php
Route::middleware('permission:view-users')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});
```

**Frontend UI:**
```tsx
{user.permissions.includes('create-users') && (
    <Button>Create User</Button>
)}
```

---

## 🛠️ Development Commands

```bash
# Development (concurrent services)
composer dev

# Individual services
php artisan serve
php artisan queue:listen
php artisan reverb:start
npm run dev

# Database
php artisan migrate:fresh --seed

# Code formatting
composer pint              # PHP
npm run format             # JS/TS

# Build for production
npm run build
composer deploy:prod
```

---

## 📋 Common Patterns

### 1. Server-Side DataTables

**Controller:**
```php
public function json(Request $request)
{
    return DataTable::of(YourModel::query())
        ->addColumn('action', function ($row) {
            return view('actions', compact('row'));
        })
        ->make(true);
}
```

**Frontend:**
```tsx
<DataTableWrapper
    ajax={{ url: route('your.json'), type: 'GET' }}
    columns={columns}
    onDelete={(id) => router.delete(route('your.destroy', id))}
/>
```

### 2. Confirmation Dialog

```tsx
const { confirmationState, handleConfirm, handleCancel, openConfirmation } = useConfirmation();

openConfirmation({
    title: 'Delete Item?',
    message: 'This cannot be undone.',
    onConfirm: () => router.delete(route('items.destroy', id)),
});

<ConfirmationDialog state={confirmationState} onConfirm={handleConfirm} onCancel={handleCancel} />
```

### 3. Form Submission

```tsx
const { data, setData, post, processing, errors } = useForm({ name: '' });

const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('items.store'), {
        onSuccess: () => toast.success('Created!'),
    });
};
```

---

## 🎯 Coding Guidelines

### Backend (Laravel)
1. **Controllers:** Single resource responsibility
2. **Models:** Use traits (HasRoles, HasMedia, LogsActivity)
3. **Validation:** Use Form Requests
4. **Helpers:** Extract reusable logic to `app/Helpers/`
5. **Format:** Run `composer pint` sebelum commit

### Frontend (React/TS)
1. **Components:** Small, reusable, single responsibility
2. **Types:** Always define TypeScript interfaces
3. **Imports:** Use `@/` alias untuk absolute imports
4. **Styling:** Use Tailwind utility classes
5. **Format:** Run `npm run format` sebelum commit

### File Naming
- **Backend:** PascalCase untuk classes (`UserController.php`)
- **Frontend Components:** PascalCase (`AppSidebar.tsx`)
- **Frontend Utils:** kebab-case (`use-appearance.tsx`)
- **Routes:** kebab-case (`/app-settings`, `/user-management`)

---

## 🔥 Important Notes

### Real-time (WebSocket)
- Laravel Reverb runs on port **8080**
- Private channels require authentication
- Echo config: `resources/js/echo.js`
- Auto-broadcast: `ActivityLogCreated` event

### File Upload (Spatie Media)
- **Public:** `storage/app/public` → `public/storage`
- **Private:** `storage/app/private` → Auth required
- **Collections:** `profile_image`, `gallery`, `attachments`
- **Helper:** `app/Helpers/MediaLibrary.php`

### Menu System
- Loaded via `AppServiceProvider` → Shared to all Inertia pages
- Permission filtering di backend (security)
- Icons from **Lucide**: `Home`, `Users`, `Settings`, etc.
- Reorder via drag & drop, auto-save

### Dark Mode
- Modes: `light`, `dark`, `system`
- Storage: Cookie + localStorage
- Toggle: `useAppearance()` hook
- Class: `.dark` on `<html>`

---

## 🐛 Troubleshooting

### WebSocket Connection Failed
```bash
php artisan reverb:start
# Check .env: BROADCAST_CONNECTION=reverb
```

### File Upload Not Working
```bash
php artisan storage:link
chmod -R 775 storage bootstrap/cache
```

### Permission Denied
```bash
php artisan permission:cache-reset
php artisan cache:clear
```

### Vite Not Loading
```bash
npm run build
php artisan optimize:clear
```

---

## 📚 Full Documentation

Baca dokumentasi lengkap di **`.claude/project.md`** untuk:
- Detailed architecture
- Complete file structure
- All available components
- Model relationships
- Design patterns
- Best practices
- Development workflow

---

## 🚀 Default Accounts

**Admin:**
- Email: `admin@example.com`
- Password: `password`
- Role: Admin (all permissions)

**User:**
- Email: `user@example.com`
- Password: `password`
- Role: User (limited permissions)

---

## 📊 Project Stats

- **Laravel:** 12.x
- **React:** 19.0
- **TypeScript:** 5.7.2
- **Models:** 7
- **Pages:** 20+
- **Components:** 40+
- **Permissions:** 14

---

**💡 Tip untuk AI Assistant:**
1. Selalu gunakan `PageContainer` untuk layout consistency
2. Prefer `Edit` tool daripada `Write` untuk existing files
3. Gunakan TypeScript interfaces yang sudah ada
4. Follow naming conventions (PascalCase components, kebab-case utils)
5. Run formatters sebelum suggest commit (Pint untuk PHP, Prettier untuk TS)

**🔗 Quick Links:**
- Full Docs: `.claude/project.md`
- Routes: `routes/web.php`
- Types: `resources/js/types/index.d.ts`
- Components: `resources/js/components/`
