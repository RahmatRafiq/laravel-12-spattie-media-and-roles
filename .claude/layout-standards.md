# Layout Standards & Component Guidelines

> **Panduan konsistensi layout untuk semua halaman dalam aplikasi**

## 📐 Layout Patterns

### 1. Standard Admin Page Layout

**Pattern ini digunakan untuk:** Semua halaman di dalam admin panel (CRUD pages, DataTables, forms yang standalone)

```tsx
import AppLayout from '@/layouts/app-layout';
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';
import { Head } from '@inertiajs/react';

export default function YourPage() {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Your Page', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Your Page Title" />
            <PageContainer maxWidth="appropriate-size">
                <Heading
                    title="Page Title"
                    description="Page description explaining what this page does"
                />
                {/* Your content here */}
            </PageContainer>
        </AppLayout>
    );
}
```

**PageContainer maxWidth Guidelines:**
- `'full'` or `'none'` → Full width (untuk DataTables, Dashboard, Galleries)
- `'2xl'` → Simple forms (1-2 columns, basic input)
- `'4xl'` → Complex forms (multiple sections, rich content)
- `'7xl'` → Galleries, Grid layouts dengan banyak item

### 2. Settings Page Layout

**Pattern ini digunakan untuk:** Halaman settings dengan sidebar navigation

```tsx
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Head } from '@inertiajs/react';

export default function SettingsPage() {
    const breadcrumbs = [
        { title: 'Settings', href: '/settings/profile' },
        { title: 'Profile', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile Information"
                        description="Update your profile details"
                    />
                    {/* Form content */}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
```

**Notes:**
- `SettingsLayout` already handles padding, spacing, and sidebar
- JANGAN gunakan `PageContainer` di dalam `SettingsLayout`
- Gunakan `HeadingSmall` untuk section headings di dalam SettingsLayout

### 3. User/Role/Permission Page Layout

**Pattern ini digunakan untuk:** User management, Role management, Permission management

```tsx
import AppLayout from '@/layouts/app-layout';
import UserRolePermissionLayout from '@/layouts/UserRolePermission/layout';
import HeadingSmall from '@/components/heading-small';
import { Head } from '@inertiajs/react';

export default function URPPage() {
    const breadcrumbs = [
        { title: 'User Management', href: route('users.index') },
        { title: 'Create User', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <UserRolePermissionLayout
                breadcrumbs={breadcrumbs}
                title="User Management"
                description="Manage users and their roles"
                active="User List"
            >
                <HeadingSmall
                    title="Create User"
                    description="Fill in the user details below"
                />
                {/* Form content */}
            </UserRolePermissionLayout>
        </AppLayout>
    );
}
```

**Notes:**
- `UserRolePermissionLayout` handles padding, spacing, and sidebar navigation
- JANGAN gunakan `PageContainer` di dalam `UserRolePermissionLayout`
- Layout ini punya sidebar khusus untuk User/Role/Permission navigation

### 4. Authentication Page Layout

**Pattern ini digunakan untuk:** Login, Register, Forgot Password, dll

```tsx
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';

export default function AuthPage() {
    return (
        <>
            <Head title="Login" />
            <AuthLayout>
                {/* Auth form content */}
            </AuthLayout>
        </>
    );
}
```

**Notes:**
- JANGAN gunakan `AppLayout` untuk auth pages
- `AuthLayout` sudah handle centering dan responsive design
- Auth pages tidak punya breadcrumbs atau sidebar

### 5. Error Page Layout

**Pattern ini digunakan untuk:** 403, 404, 500, dll

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, router } from '@inertiajs/react';

export default function ErrorPage({ message, status }) {
    return (
        <>
            <Head title="Error" />
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        {/* Icon */}
                        <CardTitle>Error Title</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{message}</p>
                        <Button onClick={() => router.visit('/dashboard')}>
                            Go Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
```

**Notes:**
- Error pages TIDAK menggunakan `AppLayout` (standalone)
- Gunakan Card component untuk container
- Full screen centering dengan `min-h-screen flex items-center justify-center`

### 6. Landing Page (Welcome) Layout

**Pattern ini digunakan untuk:** Public landing page, marketing pages

```tsx
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                {/* SEO meta tags */}
            </Head>
            <div className="min-h-screen">
                {/* Custom navigation */}
                {/* Hero section */}
                {/* Features */}
                {/* Footer */}
            </div>
        </>
    );
}
```

**Notes:**
- Landing pages TIDAK menggunakan `AppLayout`
- Custom design sesuai kebutuhan marketing
- Full creative freedom untuk layout

---

## 🎨 Component Usage Guidelines

### Heading Components

#### 1. `<Heading>` - Main Page Heading
**Gunakan di:** Top level page, setelah PageContainer

```tsx
<Heading
    title="Dashboard"
    description="Welcome to your dashboard"
/>
```

**Styling:**
- Title: `text-2xl font-semibold tracking-tight`
- Description: `text-muted-foreground`

#### 2. `<HeadingSmall>` - Section Heading
**Gunakan di:** Sections di dalam page, cards, forms

```tsx
<HeadingSmall
    title="Profile Information"
    description="Update your personal details"
/>
```

**Styling:**
- Title: `text-lg font-medium`
- Description: `text-sm text-muted-foreground`

### Button Patterns

#### 1. Primary Action Button
```tsx
<Button type="submit" disabled={processing}>
    Save Changes
</Button>
```

#### 2. Secondary Action Button
```tsx
<Button type="button" variant="outline">
    Cancel
</Button>
```

#### 3. Link Button (Cancel, Back, etc.)
```tsx
<Button type="button" variant="outline" asChild>
    <Link href={route('users.index')}>Cancel</Link>
</Button>
```

**JANGAN:**
```tsx
// ❌ WRONG - Don't use Link with manual Tailwind classes
<Link href={route('users.index')} className="bg-gray-300 px-4 py-2...">
    Cancel
</Link>
```

#### 4. Button Group / Action Group
```tsx
<div className="flex items-center gap-4">
    <Button type="submit" disabled={processing}>
        Save
    </Button>
    <Button type="button" variant="outline" asChild>
        <Link href={route('back')}>Cancel</Link>
    </Button>
</div>
```

**Spacing:**
- Gunakan `gap-4` untuk spacing horizontal (bukan `space-x-4`)
- Gunakan `gap-6` untuk spacing vertikal (bukan `space-y-6`)

### Form Layout

#### Standard Form Pattern
```tsx
<form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
        />
        <InputError message={errors.name} />
    </div>

    {/* More fields */}

    <div className="flex items-center gap-4">
        <Button type="submit" disabled={processing}>
            Save
        </Button>
        <Button type="button" variant="outline" asChild>
            <Link href={route('back')}>Cancel</Link>
        </Button>
    </div>
</form>
```

**Guidelines:**
- Form: `space-y-6` (24px vertical spacing)
- Field wrapper: `space-y-2` (8px spacing between label, input, error)
- Button group: `gap-4` (16px horizontal spacing)

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T

```tsx
// 1. DON'T use manual padding in AppLayout
<AppLayout>
    <div className="p-4"> {/* ❌ */}
        <h1>Title</h1>
    </div>
</AppLayout>

// 2. DON'T use PageContainer inside SettingsLayout
<SettingsLayout>
    <PageContainer> {/* ❌ */}
        Content
    </PageContainer>
</SettingsLayout>

// 3. DON'T use manual heading instead of component
<div className="px-4 py-6"> {/* ❌ */}
    <h1 className="text-2xl font-bold">Title</h1>
    <p className="text-gray-600">Description</p>
</div>

// 4. DON'T use Link with manual Tailwind for buttons
<Link href="#" className="bg-blue-500 text-white px-4 py-2"> {/* ❌ */}
    Action
</Link>

// 5. DON'T mix space-x with gap
<div className="flex items-center space-x-4 gap-4"> {/* ❌ */}
```

### ✅ DO

```tsx
// 1. DO use PageContainer for admin pages
<AppLayout>
    <PageContainer maxWidth="4xl">
        <Heading title="Title" />
    </PageContainer>
</AppLayout>

// 2. DO use direct content in SettingsLayout
<SettingsLayout>
    <div className="space-y-6">
        <HeadingSmall title="Title" />
        Content
    </div>
</SettingsLayout>

// 3. DO use Heading component
<PageContainer maxWidth="4xl">
    <Heading
        title="Page Title"
        description="Description"
    />
</PageContainer>

// 4. DO use Button component for links
<Button variant="outline" asChild>
    <Link href="#">Action</Link>
</Button>

// 5. DO use gap consistently
<div className="flex items-center gap-4">
```

---

## 📏 Spacing Standards

### Vertical Spacing (space-y, gap for flex-col)
- `space-y-2` / `gap-2` (8px) → Between label, input, error in form field
- `space-y-4` / `gap-4` (16px) → Between sections dalam card
- `space-y-6` / `gap-6` (24px) → Between form fields, major sections
- `space-y-8` / `gap-8` (32px) → Between major page sections

### Horizontal Spacing (gap for flex-row)
- `gap-2` (8px) → Icon + text, tight grouping
- `gap-4` (16px) → Buttons, form actions
- `gap-6` (24px) → Cards in grid, larger grouping
- `gap-8` (32px) → Major horizontal sections

### Padding Standards
- PageContainer: `px-4 py-6` (handled automatically)
- Card: Use CardHeader, CardContent (automatic padding)
- Dialog/Sheet: Use built-in padding dari shadcn/ui

---

## 🎯 Layout Decision Tree

```
Start
 │
 ├─ Is it an admin page?
 │   ├─ YES → Use AppLayout + PageContainer
 │   │         └─ Choose maxWidth based on content type
 │   │
 │   └─ NO → Continue...
 │
 ├─ Is it a settings page?
 │   ├─ YES → Use AppLayout + SettingsLayout
 │   │         └─ Use HeadingSmall for sections
 │   │
 │   └─ NO → Continue...
 │
 ├─ Is it a User/Role/Permission page?
 │   ├─ YES → Use AppLayout + UserRolePermissionLayout
 │   │         └─ Use HeadingSmall for sections
 │   │
 │   └─ NO → Continue...
 │
 ├─ Is it an auth page (login, register)?
 │   ├─ YES → Use AuthLayout only
 │   │         └─ No breadcrumbs, no sidebar
 │   │
 │   └─ NO → Continue...
 │
 ├─ Is it an error page (403, 404)?
 │   ├─ YES → Use standalone Card layout
 │   │         └─ Full screen centering
 │   │
 │   └─ NO → Continue...
 │
 └─ Is it a landing/marketing page?
     └─ YES → Custom layout, no restrictions
```

---

## ✅ Checklist Sebelum Commit

Sebelum commit perubahan layout, pastikan:

- [ ] Halaman menggunakan layout yang benar (AppLayout, SettingsLayout, dll)
- [ ] Menggunakan PageContainer dengan maxWidth yang sesuai (atau tidak pakai jika di SettingsLayout/URPLayout)
- [ ] Menggunakan Heading atau HeadingSmall component (bukan manual h1/h2)
- [ ] Button menggunakan shadcn/ui Button component (bukan Link dengan Tailwind manual)
- [ ] Spacing konsisten (gap-4, space-y-6, dll sesuai standard)
- [ ] Breadcrumbs ada dan benar (kecuali auth/error pages)
- [ ] Head title sudah diset dengan benar
- [ ] Dark mode compatible (gunakan semantic colors)
- [ ] Responsive (test di mobile view)

---

## 📝 Quick Reference

### Import yang Sering Digunakan

```tsx
// Layouts
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AuthLayout from '@/layouts/auth-layout';
import UserRolePermissionLayout from '@/layouts/UserRolePermission/layout';

// Components
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

// Inertia
import { Head, Link, useForm } from '@inertiajs/react';
```

### Typical Page Structure

```tsx
export default function PageName({ props }) {
    const breadcrumbs = [/* ... */];
    const { data, setData, post, processing, errors } = useForm({/* ... */});

    const handleSubmit = (e) => {/* ... */};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Page Title" />
            <PageContainer maxWidth="4xl">
                <Heading title="Title" description="Description" />
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form fields */}
                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('back')}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </PageContainer>
        </AppLayout>
    );
}
```

---

**Last Updated:** 2025-11-29
**Version:** 1.0.0
