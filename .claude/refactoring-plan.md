# 🔧 Refactoring Plan: Modular Architecture & Scalability

> **Branch:** `refactor/modular-architecture-scalability`
> **Goal:** Transform codebase menjadi modular, scalable, dan maintainable super app foundation
> **Estimated Duration:** 2-3 weeks (8-12 working days)

---

## 📋 Executive Summary

### Masalah yang Diidentifikasi

| Category | Issues | Severity | Files Affected |
|----------|---------|----------|----------------|
| **Type System** | Merged types, inline types, duplicates | 🔴 HIGH | 6+ files |
| **Backend Query** | Direct queries in controllers | 🔴 CRITICAL | 4+ controllers |
| **Business Logic** | Logic in controllers (not services) | 🔴 HIGH | 5+ controllers |
| **Code Duplication** | 180+ lines duplicated styles | 🟡 MEDIUM | 8+ files |
| **Component Concerns** | Mixed UI + logic + fetching | 🔴 HIGH | 6+ components |
| **Missing Abstractions** | No service layer, no repositories | 🔴 CRITICAL | Architecture-wide |

### Target Architecture

```
┌─────────────────── FRONTEND ───────────────────┐
│                                                 │
│  Pages → Hooks → Components → Utils            │
│    ↓       ↓         ↓          ↓              │
│  Types (by domain) ← Shared Types              │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↕ API
┌─────────────────── BACKEND ────────────────────┐
│                                                 │
│  Controllers (HTTP layer only)                 │
│       ↓                                         │
│  Services (Business logic)                     │
│       ↓                                         │
│  Repositories (Data access)                    │
│       ↓                                         │
│  Models (Eloquent)                             │
│                                                 │
│  Resources/DTOs (Data transformation)          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Phase 1: Backend Foundation (Week 1)

**Goal:** Buat layer abstraction yang solid untuk scalability

### Day 1-2: Repository Pattern

#### 1.1 Create Repository Interfaces

**Files to create:**
```
app/Repositories/Contracts/
├── BaseRepositoryInterface.php
├── UserRepositoryInterface.php
├── RoleRepositoryInterface.php
├── PermissionRepositoryInterface.php
├── GalleryRepositoryInterface.php
├── MenuRepositoryInterface.php
└── ActivityLogRepositoryInterface.php
```

**BaseRepositoryInterface.php:**
```php
interface BaseRepositoryInterface
{
    public function all(array $columns = ['*']);
    public function find(int $id);
    public function findOrFail(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function with(array $relations);
    public function paginate(int $perPage = 15);
}
```

**UserRepositoryInterface.php:**
```php
interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function getActiveUsers();
    public function getTrashedUsers();
    public function getAllIncludingTrashed();
    public function getUsersWithRoles();
    public function searchUsers(string $query);
    public function forDataTable(array $filters = []);
}
```

#### 1.2 Implement Eloquent Repositories

**Files to create:**
```
app/Repositories/Eloquent/
├── BaseRepository.php
├── UserRepository.php
├── RoleRepository.php
├── PermissionRepository.php
├── GalleryRepository.php
├── MenuRepository.php
└── ActivityLogRepository.php
```

**BaseRepository.php:**
```php
abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    // Implement all BaseRepositoryInterface methods...
}
```

**UserRepository.php:**
```php
class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function getActiveUsers()
    {
        return $this->model->newQuery()
            ->with('roles')
            ->get();
    }

    public function forDataTable(array $filters = [])
    {
        $query = $this->model->newQuery();

        // Extract query logic from UserController::json()
        if (isset($filters['status'])) {
            $query = match ($filters['status']) {
                'trashed' => $query->onlyTrashed(),
                'all' => $query->withTrashed(),
                default => $query,
            };
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }

        return $query->with('roles');
    }
}
```

#### 1.3 Bind Repositories in Service Provider

**File:** `app/Providers/RepositoryServiceProvider.php` (new)

```php
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );

        $this->app->bind(
            RoleRepositoryInterface::class,
            RoleRepository::class
        );

        // ... other bindings
    }
}
```

**Register in:** `bootstrap/providers.php`

---

### Day 3-4: Service Layer

#### 2.1 Create Service Classes

**Files to create:**
```
app/Services/
├── UserService.php
├── RoleService.php
├── PermissionService.php
├── GalleryService.php
├── MenuService.php
└── ActivityLogService.php
```

**UserService.php:**
```php
class UserService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function getDataTableData(array $filters): Builder
    {
        return $this->userRepository->forDataTable($filters);
    }

    public function createUser(array $data): User
    {
        // Business logic for user creation
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if (isset($data['role_id'])) {
            $user->assignRole($data['role_id']);
        }

        return $user;
    }

    public function updateUser(int $id, array $data): User
    {
        // Business logic for user update
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if (isset($data['password']) && !empty($data['password'])) {
            $userData['password'] = Hash::make($data['password']);
        }

        $user = $this->userRepository->update($id, $userData);

        if (isset($data['role_id'])) {
            $user->syncRoles([$data['role_id']]);
        }

        return $user;
    }

    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    public function restoreUser(int $id): bool
    {
        $user = $this->userRepository->findTrashed($id);
        return $user?->restore() ?? false;
    }
}
```

**GalleryService.php:**
```php
class GalleryService
{
    public function __construct(
        private GalleryRepositoryInterface $galleryRepository
    ) {}

    /**
     * Classify disks by visibility (public/private)
     * Extracted from GalleryController::index()
     */
    public function classifyDisksByVisibility(): array
    {
        $allDisks = $this->galleryRepository->getAllDisks();
        $publicDisks = [];
        $privateDisks = [];

        foreach ($allDisks as $disk) {
            $diskConfig = config("filesystems.disks.{$disk}");

            if ($this->isPublicDisk($diskConfig)) {
                $publicDisks[] = $disk;
            } else {
                $privateDisks[] = $disk;
            }
        }

        return [
            'public' => $publicDisks,
            'private' => $privateDisks,
        ];
    }

    private function isPublicDisk(?array $diskConfig): bool
    {
        if (!$diskConfig) {
            return false;
        }

        return ($diskConfig['driver'] ?? null) === 'local'
            && isset($diskConfig['url'])
            && str_contains($diskConfig['url'], '/storage');
    }

    public function getMediaByVisibility(
        string $visibility,
        string $collection = 'gallery'
    ): Builder {
        $disks = $this->classifyDisksByVisibility();
        $selectedDisks = $visibility === 'public'
            ? $disks['public']
            : $disks['private'];

        return $this->galleryRepository
            ->getByCollectionAndDisks($collection, $selectedDisks);
    }
}
```

#### 2.2 Create Common Traits

**File:** `app/Traits/HasDataTableSearch.php`

```php
trait HasDataTableSearch
{
    protected function applyDataTableSearch(
        Builder $query,
        ?string $search,
        array $searchableColumns
    ): Builder {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search, $searchableColumns) {
            foreach ($searchableColumns as $column) {
                $q->orWhere($column, 'like', "%{$search}%");
            }
        });
    }

    protected function getDataTableTotalCallback(
        ?string $search,
        string $modelClass,
        ?string $filter = null
    ): ?callable {
        if (empty($search)) {
            return null;
        }

        return function () use ($modelClass, $filter) {
            $query = $modelClass::query();

            if ($filter === 'trashed') {
                $query->onlyTrashed();
            } elseif ($filter === 'all') {
                $query->withTrashed();
            }

            return $query->count();
        };
    }
}
```

---

### Day 5: DTOs and Resources

#### 3.1 Create Data Transfer Objects

**Files to create:**
```
app/DataTransferObjects/
├── UserData.php
├── RoleData.php
└── GalleryData.php
```

**UserData.php:**
```php
class UserData
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $password,
        public readonly ?int $roleId,
        public readonly ?array $permissions,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            id: $request->integer('id', null),
            name: $request->string('name'),
            email: $request->string('email'),
            password: $request->filled('password')
                ? $request->string('password')
                : null,
            roleId: $request->integer('role_id', null),
            permissions: $request->array('permissions', []),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'role_id' => $this->roleId,
            'permissions' => $this->permissions,
        ], fn ($value) => $value !== null);
    }
}
```

#### 3.2 Create API Resources

**Files to create:**
```
app/Http/Resources/
├── UserResource.php
├── RoleResource.php
└── ActivityLogResource.php
```

**UserResource.php:**
```php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'roles' => $this->roles->pluck('name'),
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'is_admin' => $this->hasRole('admin'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}
```

**ActivityLogResource.php:**
```php
class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'event' => $this->event,
            'causer_type' => $this->causer_type,
            'causer_id' => $this->causer_id,
            'properties' => $this->properties,
            'created_at' => $this->created_at?->toISOString(),
            'causer_name' => $this->causer?->name ?? 'System',
        ];
    }
}
```

#### 3.3 Refactor Controllers

**Update:** `app/Http/Controllers/UserRolePermission/UserController.php`

**Before (lines 25-74):**
```php
public function json(Request $request)
{
    $search = $request->input('search.value', '');
    $filter = $request->query('filter') ?? 'active';

    $baseQuery = match ($filter) {
        'trashed' => User::onlyTrashed()->with('roles'),
        'all' => User::withTrashed()->with('roles'),
        default => User::with('roles'),
    };

    // ... 50+ lines of query logic
}
```

**After:**
```php
public function json(Request $request)
{
    $filters = [
        'search' => $request->input('search.value'),
        'status' => $request->query('filter', 'active'),
    ];

    $query = $this->userService->getDataTableData($filters);

    $recordsTotalCallback = $filters['search']
        ? fn() => User::count()
        : null;

    return DataTable::of($query)
        ->setRecordsTotalCallback($recordsTotalCallback)
        ->addColumn('roles', fn($user) => $user->roles->pluck('name'))
        ->addColumn('permissions', fn($user) => $user->getAllPermissions()->count())
        ->addColumn('action', fn($user) => route('users.edit', $user))
        ->make(true);
}

public function store(StoreUserRequest $request)
{
    try {
        $userData = UserData::fromRequest($request);
        $user = $this->userService->createUser($userData->toArray());

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully');
    } catch (\Exception $e) {
        return back()
            ->withInput()
            ->withErrors(['error' => $e->getMessage()]);
    }
}
```

---

## 🎨 Phase 2: Frontend Foundation (Week 2)

**Goal:** Modularisasi type system, components, dan utilities

### Day 1-2: Type System Refactoring

#### 4.1 Split Types by Domain

**Current structure:**
```
resources/js/types/
├── index.d.ts (300+ lines, all types merged)
└── UserRolePermission.d.ts (duplicate User type)
```

**Target structure:**
```
resources/js/types/
├── index.ts (exports only)
├── user.d.ts
├── role.d.ts
├── permission.d.ts
├── navigation.d.ts
├── gallery.d.ts
├── app-settings.d.ts
├── activity-log.d.ts
└── shared.d.ts
```

#### 4.2 Create Domain-Specific Types

**File:** `resources/js/types/user.d.ts`

```typescript
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
    permissions: string[];
    is_admin: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role_id?: number;
    permissions?: string[];
}

export interface UserFilters {
    search?: string;
    status?: 'active' | 'trashed' | 'all';
    role?: string;
}
```

**File:** `resources/js/types/navigation.d.ts`

```typescript
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    id: number;
    title: string;
    route?: string | null;
    icon?: string | null;
    permission?: string | null;
    parent_id?: number | null;
    order?: number;
    children?: MenuItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    children?: NavItem[];
    isActive?: boolean;
    badge?: string | number;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}
```

**File:** `resources/js/types/gallery.d.ts`

```typescript
export interface GalleryItem {
    id: number;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    disk: string;
    collection_name: string;
    url?: string;
    preview_url?: string;
    created_at: string;
}

export interface GalleryFilters {
    visibility?: 'public' | 'private';
    collection?: string;
    folder?: string;
}

export interface FolderItem {
    id: number;
    name: string;
    parent_id?: number | null;
    children?: FolderItem[];
}
```

**File:** `resources/js/types/shared.d.ts`

```typescript
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface SelectOption<T = string | number> {
    value: T;
    label: string;
    disabled?: boolean;
}

export interface ConfirmationDialogState {
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
}
```

**File:** `resources/js/types/index.ts`

```typescript
// Re-export all domain types
export * from './user';
export * from './role';
export * from './permission';
export * from './navigation';
export * from './gallery';
export * from './app-settings';
export * from './activity-log';
export * from './shared';

// Global Inertia types
export interface PageProps<T = Record<string, unknown>> {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    errors?: Record<string, string>;
    sidebarMenus?: MenuItem[];
    appSetting?: AppSetting;
    breadcrumbs?: BreadcrumbItem[];
}
```

#### 4.3 Remove Duplicate Types

**Delete:** `resources/js/types/UserRolePermission.d.ts` (duplicate User interface)

**Update all imports:**
```typescript
// Before
import { User } from '@/types/index';

// After (still works, re-exported)
import { User } from '@/types';

// Or specific import
import { User } from '@/types/user';
```

---

### Day 3: Utilities Extraction

#### 5.1 Extract React-Select Styles

**File:** `resources/js/utils/select-styles.ts`

```typescript
import { StylesConfig } from 'react-select';

export interface SelectStylesOptions {
    isDark: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function createSelectStyles<OptionType = unknown, IsMulti extends boolean = false>(
    options: SelectStylesOptions
): StylesConfig<OptionType, IsMulti> {
    const { isDark, size = 'md' } = options;

    const heights = {
        sm: '2rem',
        md: '2.25rem',
        lg: '2.5rem',
    };

    return {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
            borderColor: state.isFocused
                ? isDark ? 'oklch(0.439 0 0)' : 'oklch(0.87 0 0)'
                : isDark ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)',
            boxShadow: state.isFocused
                ? `0 0 0 2px ${isDark ? 'oklch(0.439 0 0 / 0.5)' : 'oklch(0.87 0 0 / 0.5)'}`
                : 'none',
            borderRadius: '0.375rem',
            minHeight: heights[size],
            '&:hover': {
                borderColor: isDark ? 'oklch(0.439 0 0)' : 'oklch(0.87 0 0)',
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
            border: `1px solid ${isDark ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)'}`,
            boxShadow: isDark
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? isDark ? 'oklch(0.439 0 0)' : 'oklch(0.87 0 0)'
                : state.isFocused
                ? isDark ? 'oklch(0.269 0 0)' : 'oklch(0.961 0 0)'
                : 'transparent',
            color: state.isSelected
                ? isDark ? 'oklch(0.961 0 0)' : 'oklch(0.205 0 0)'
                : isDark ? 'oklch(0.922 0 0)' : 'oklch(0.269 0 0)',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: isDark ? 'oklch(0.439 0 0)' : 'oklch(0.87 0 0)',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.922 0 0)' : 'oklch(0.269 0 0)',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.569 0 0)' : 'oklch(0.659 0 0)',
        }),
        input: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.922 0 0)' : 'oklch(0.269 0 0)',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.922 0 0)' : 'oklch(0.269 0 0)',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.922 0 0)' : 'oklch(0.269 0 0)',
            ':hover': {
                backgroundColor: isDark ? 'oklch(0.439 0 0)' : 'oklch(0.87 0 0)',
                color: isDark ? 'oklch(0.961 0 0)' : 'oklch(0.205 0 0)',
            },
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.569 0 0)' : 'oklch(0.659 0 0)',
            ':hover': {
                color: isDark ? 'oklch(0.922 0 0)' : 'oklch(0.269 0 0)',
            },
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.569 0 0)' : 'oklch(0.659 0 0)',
            ':hover': {
                color: isDark ? 'oklch(0.922 0 0)' : 'oklch(0.269 0 0)',
            },
        }),
    };
}
```

**Update:** `resources/js/components/select.tsx`

```typescript
import { useDarkMode } from '@/hooks/use-dark-mode';
import { createSelectStyles } from '@/utils/select-styles';

export const CustomSelect = <OptionType = unknown, IsMulti extends boolean = false>({
    size = 'md',
    ...props
}: CustomSelectProps<OptionType, IsMulti>) => {
    const isDark = useDarkMode();
    const customStyles = createSelectStyles<OptionType, IsMulti>({ isDark, size });

    return (
        <ReactSelect
            {...props}
            styles={customStyles}
            classNamePrefix="custom-select"
        />
    );
};
```

#### 5.2 Extract Icon Registry

**File:** `resources/js/utils/icon-registry.ts`

```typescript
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type IconName = keyof typeof Icons;

export const iconRegistry: Record<string, LucideIcon> = Icons as any;

export function getIcon(name?: string | null): LucideIcon | undefined {
    if (!name) return undefined;
    return iconRegistry[name];
}

export function getIconComponent(name?: string | null): LucideIcon {
    const icon = getIcon(name);
    return icon ?? Icons.Circle; // Default fallback
}
```

**Update:** `resources/js/components/app-sidebar.tsx`

```typescript
// Before: 280+ lines of imports
import {
    ListChecks, Activity, FileText, Github, Key,
    // ... 170+ more
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    ListChecks, Activity, FileText, Github, Key,
    // ... 170+ more
};

// After: 1 line
import { getIcon } from '@/utils/icon-registry';

function mapMenuToNavItem(menu: MenuItem): NavItem {
    return {
        title: menu.title,
        href: menu.route ? route(menu.route) : '#',
        icon: getIcon(menu.icon),
        children: menu.children?.map(mapMenuToNavItem),
    };
}
```

#### 5.3 Extract className Utilities

**File:** `resources/js/utils/class-names.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Conditional class names helper
 */
export function conditionalClass(
    condition: boolean,
    trueClass: string,
    falseClass?: string
): string {
    return condition ? trueClass : falseClass ?? '';
}

/**
 * Variant-based class names
 */
export function variantClass<T extends string>(
    variant: T,
    variants: Record<T, string>,
    defaultVariant?: string
): string {
    return variants[variant] ?? defaultVariant ?? '';
}
```

---

### Day 4-5: Custom Hooks

#### 6.1 Create useDarkMode Hook

**File:** `resources/js/hooks/use-dark-mode.ts`

```typescript
import { useState, useEffect } from 'react';

export function useDarkMode(): boolean {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        // Initial check
        checkDarkMode();

        // Watch for changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
}
```

**Replace in components:**
- `resources/js/components/select.tsx`
- `resources/js/components/custom-async-select.tsx`

```typescript
// Before (duplicated in 2 files)
const [isDark, setIsDark] = useState(false);
useEffect(() => {
    const checkDarkMode = () => { ... };
    // ... 15 lines
}, []);

// After
import { useDarkMode } from '@/hooks/use-dark-mode';
const isDark = useDarkMode();
```

#### 6.2 Create usePrivateImage Hook

**File:** `resources/js/hooks/use-private-image.ts`

```typescript
import { useState, useEffect } from 'react';

export interface UsePrivateImageOptions {
    onError?: () => void;
    enabled?: boolean;
}

export interface UsePrivateImageReturn {
    blobUrl: string | null;
    loading: boolean;
    error: boolean;
    refetch: () => void;
}

export function usePrivateImage(
    src: string,
    options: UsePrivateImageOptions = {}
): UsePrivateImageReturn {
    const { onError, enabled = true } = options;
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [refetchKey, setRefetchKey] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        let objectUrl: string | null = null;

        const fetchImage = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(src, {
                    credentials: 'include',
                    headers: {
                        Accept: 'image/*',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                setBlobUrl(objectUrl);
            } catch (err) {
                console.error('Failed to load private image:', err);
                setError(true);
                onError?.();
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src, onError, enabled, refetchKey]);

    const refetch = () => setRefetchKey((prev) => prev + 1);

    return { blobUrl, loading, error, refetch };
}
```

**Update:** `resources/js/components/private-image.tsx`

```typescript
// Before: 60+ lines with mixed concerns
export function PrivateImage({ src, alt, className, onError }: PrivateImageProps) {
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        let objectUrl: string | null = null;

        const fetchImage = async () => {
            // ... 30+ lines of fetch logic
        };

        fetchImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src, onError]);

    // ... rendering logic
}

// After: Clean component with hook
import { usePrivateImage } from '@/hooks/use-private-image';

export function PrivateImage({ src, alt, className, onError }: PrivateImageProps) {
    const { blobUrl, loading, error } = usePrivateImage(src, { onError });

    if (loading) {
        return <Skeleton className={cn('rounded-md', className)} />;
    }

    if (error || !blobUrl) {
        return (
            <div className={cn('flex items-center justify-center bg-muted rounded-md', className)}>
                <ImageOff className="h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    return (
        <img
            src={blobUrl}
            alt={alt}
            className={className}
            loading="lazy"
        />
    );
}
```

#### 6.3 Create useApi Hook

**File:** `resources/js/hooks/use-api.ts`

```typescript
import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

export interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
}

export interface UseApiReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    execute: (url: string, data?: any) => Promise<void>;
    reset: () => void;
}

export function useApi<T = unknown>(
    options: UseApiOptions<T> = {}
): UseApiReturn<T> {
    const { onSuccess, onError, method = 'get' } = options;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(
        async (url: string, payload?: any) => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(url, {
                    method: method.toUpperCase(),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'include',
                    body: payload ? JSON.stringify(payload) : undefined,
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();
                setData(result);
                onSuccess?.(result);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Unknown error');
                setError(error);
                onError?.(error);
            } finally {
                setLoading(false);
            }
        },
        [method, onSuccess, onError]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
}
```

#### 6.4 Create useDataTable Hook

**File:** `resources/js/hooks/use-data-table.ts`

```typescript
import { useRef, useCallback } from 'react';
import { DataTableWrapperRef } from '@/components/datatables';

export interface UseDataTableReturn {
    tableRef: React.RefObject<DataTableWrapperRef>;
    reload: () => void;
    clearFilters: () => void;
}

export function useDataTable(): UseDataTableReturn {
    const tableRef = useRef<DataTableWrapperRef>(null);

    const reload = useCallback(() => {
        tableRef.current?.reload();
    }, []);

    const clearFilters = useCallback(() => {
        tableRef.current?.clearFilters();
    }, []);

    return {
        tableRef,
        reload,
        clearFilters,
    };
}
```

---

## 📊 Phase 3: Integration & Testing (Week 3)

### Day 1-2: Backend Integration

#### 7.1 Refactor All Controllers

**Controllers to update:**
- ✅ UserController
- ✅ RoleController
- ✅ PermissionController
- ✅ GalleryController
- ✅ MenuController
- ✅ ActivityLogController

**Pattern for all:**
```php
class SomeController extends Controller
{
    public function __construct(
        private SomeService $service
    ) {}

    public function index()
    {
        // Minimal HTTP logic only
        return Inertia::render('Some/Index', [
            'items' => $this->service->getAllItems(),
        ]);
    }

    public function store(StoreSomeRequest $request)
    {
        $data = SomeData::fromRequest($request);
        $item = $this->service->createItem($data);

        return redirect()
            ->route('some.index')
            ->with('success', 'Item created successfully');
    }
}
```

#### 7.2 Update AppServiceProvider

**Before:**
```php
Inertia::share('sidebarMenus', function () {
    $user = auth()->user();
    if (!$user) return [];

    // 30+ lines of complex query logic
    $menus = \App\Models\Menu::with(['children' => ...])
        ->whereNull('parent_id')
        ->orderBy('order')
        ->get()
        ->filter(...)
        ->map(...);

    return $menus;
});
```

**After:**
```php
Inertia::share('sidebarMenus', function () {
    return app(MenuService::class)->getMenusForCurrentUser();
});
```

---

### Day 3-4: Frontend Integration

#### 8.1 Update All Page Components

**Pattern:**
```tsx
// Before: Mixed types, inline logic
type User = {
    id: number;
    name: string;
    // ...
};

export default function UserIndex() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // 15+ lines dark mode logic
    }, []);

    // ...
}

// After: Clean with proper imports
import { User, UserFilters } from '@/types';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useDataTable } from '@/hooks/use-data-table';

export default function UserIndex() {
    const isDark = useDarkMode();
    const { tableRef, reload } = useDataTable();

    // ...
}
```

#### 8.2 Update Component Imports

**Global find & replace:**
```typescript
// Old imports
import { User } from '@/types/index';
import { BreadcrumbItem } from '@/types/index';

// New imports (still works, re-exported)
import { User, BreadcrumbItem } from '@/types';

// Or specific domain import
import { User } from '@/types/user';
import { BreadcrumbItem } from '@/types/navigation';
```

---

### Day 5: Documentation & Cleanup

#### 9.1 Update Documentation

**Files to update:**
```
.claude/
├── project.md (architecture updates)
├── refactoring-plan.md (this file, mark completed)
└── migration-guide.md (new)
```

**Create:** `.claude/migration-guide.md`

```markdown
# Migration Guide: Modular Architecture

## Backend Changes

### Controllers
Controllers are now thin HTTP layers. Business logic moved to Services.

**Before:**
```php
public function store(Request $request)
{
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $user->assignRole($request->role_id);

    return redirect()->route('users.index');
}
```

**After:**
```php
public function store(StoreUserRequest $request)
{
    $userData = UserData::fromRequest($request);
    $this->userService->createUser($userData->toArray());

    return redirect()->route('users.index');
}
```

### Services
New service layer handles business logic.

**Usage:**
```php
// Inject in constructor
public function __construct(private UserService $userService) {}

// Use in methods
$users = $this->userService->getDataTableData($filters);
$user = $this->userService->createUser($data);
```

### Repositories
Data access abstraction.

**Usage:**
```php
// Via Service (preferred)
$users = $this->userService->getAllUsers();

// Direct injection (if needed)
public function __construct(private UserRepositoryInterface $userRepository) {}
```

## Frontend Changes

### Types
Types now organized by domain.

**Before:**
```typescript
import { User } from '@/types/index';
```

**After:**
```typescript
// Still works (re-exported)
import { User } from '@/types';

// Or specific import
import { User } from '@/types/user';
```

### Hooks
Common logic extracted to hooks.

**Before:**
```typescript
const [isDark, setIsDark] = useState(false);
useEffect(() => {
    // Dark mode logic
}, []);
```

**After:**
```typescript
import { useDarkMode } from '@/hooks/use-dark-mode';
const isDark = useDarkMode();
```

### Utilities
Reusable utilities for common tasks.

**Before:**
```typescript
const customStyles = {
    control: (provided) => ({
        // 90+ lines of styles
    }),
    // ...
};
```

**After:**
```typescript
import { createSelectStyles } from '@/utils/select-styles';
const customStyles = createSelectStyles({ isDark });
```
```

#### 9.2 Update CLAUDE.md

**Add section:**
```markdown
## 🏗️ Architecture

### Backend Layers
```
Controllers (HTTP) → Services (Business Logic) → Repositories (Data Access) → Models
                  ↘ Resources/DTOs (Transformation)
```

### Frontend Structure
```
Pages → Hooks → Components → Utils
  ↓       ↓         ↓          ↓
Types (by domain) ← Shared Types
```

### Key Principles
- **Separation of Concerns:** Each layer has single responsibility
- **Dependency Injection:** Services/repositories injected via constructor
- **Type Safety:** Domain-specific types, no inline types
- **DRY:** Reusable hooks, utilities, and components
- **Testability:** Business logic in services (easy to test)
```

#### 9.3 Create Architecture Diagram

**File:** `.claude/architecture.md`

```markdown
# Architecture Overview

## Backend Flow

```
HTTP Request
    ↓
Route (web.php)
    ↓
Controller (HTTP layer)
    ├── Validates via FormRequest
    ├── Transforms via DTO
    ↓
Service (Business Logic)
    ├── Coordinates operations
    ├── Applies business rules
    ↓
Repository (Data Access)
    ├── Queries database
    ├── Returns Eloquent models
    ↓
Model (Eloquent ORM)
    ↓
Database
    ↓
Response via Resource/DTO
    ↓
Inertia Response
```

## Frontend Flow

```
Page Component
    ↓
Custom Hooks (useDarkMode, useDataTable, etc.)
    ↓
Reusable Components (DataTable, Select, etc.)
    ↓
Utility Functions (createSelectStyles, getIcon, etc.)
    ↓
TypeScript Types (domain-specific)
    ↓
API Call (via Inertia or fetch)
```

## Directory Structure

```
app/
├── Http/
│   ├── Controllers/        # HTTP layer only
│   ├── Requests/           # Form validation
│   └── Resources/          # API responses
├── Services/               # Business logic
├── Repositories/
│   ├── Contracts/          # Interfaces
│   └── Eloquent/           # Implementations
├── DataTransferObjects/    # Data transformation
├── Models/                 # Eloquent models
└── Traits/                 # Reusable traits

resources/js/
├── pages/                  # Inertia pages
├── components/             # Reusable UI
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── types/                  # TypeScript types (by domain)
└── layouts/                # Page layouts
```
```

---

## ✅ Success Criteria

### Backend
- [ ] All controllers < 100 lines
- [ ] No direct Eloquent queries in controllers
- [ ] All business logic in services
- [ ] Services covered by tests (>80% coverage)
- [ ] Repositories implement interfaces
- [ ] DTOs used for data transfer
- [ ] Resources used for API responses

### Frontend
- [ ] No duplicate type definitions
- [ ] All inline types moved to type files
- [ ] Types organized by domain
- [ ] No code duplication >50 lines
- [ ] Common logic extracted to hooks
- [ ] Utilities reused across components
- [ ] All components < 200 lines

### Testing
- [ ] Backend unit tests for services
- [ ] Backend integration tests for repositories
- [ ] Frontend component tests
- [ ] E2E tests for critical flows

### Documentation
- [ ] Architecture documented
- [ ] Migration guide created
- [ ] Code examples updated
- [ ] CLAUDE.md reflects new structure

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Run all tests: `php artisan test`
- [ ] Run code formatters: `composer pint && npm run format`
- [ ] Check TypeScript: `npm run type-check`
- [ ] Build frontend: `npm run build`
- [ ] Clear caches: `php artisan optimize:clear`

### Deployment
- [ ] Merge to main via PR
- [ ] Tag release: `git tag v2.0.0-modular`
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production

### Post-deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Update team documentation
- [ ] Notify stakeholders

---

## 📚 References

### Design Patterns Used
- **Repository Pattern:** Data access abstraction
- **Service Layer Pattern:** Business logic separation
- **DTO Pattern:** Data transfer objects
- **Dependency Injection:** Constructor injection
- **Hook Pattern:** React custom hooks
- **Factory Pattern:** Utility factories (createSelectStyles)

### Best Practices
- **SOLID Principles:** Single responsibility, dependency inversion
- **DRY:** Don't repeat yourself
- **KISS:** Keep it simple, stupid
- **YAGNI:** You ain't gonna need it
- **Separation of Concerns:** Each layer has single responsibility

### Recommended Reading
- Laravel: Repository Pattern in Practice
- React: Custom Hooks Best Practices
- TypeScript: Organizing Types and Interfaces
- Clean Architecture by Robert C. Martin

---

## 🤝 Contributing

When adding new features after this refactoring:

1. **Backend:**
   - Create Service class for business logic
   - Create Repository if new model
   - Use DTOs for data transfer
   - Keep controllers thin (HTTP only)

2. **Frontend:**
   - Define types in appropriate domain file
   - Extract reusable logic to hooks
   - Use existing utilities
   - Keep components focused

3. **Testing:**
   - Write service tests first (TDD)
   - Test repositories with in-memory DB
   - Component tests for UI logic

---

**🎯 Goal:** Super app foundation yang modular, scalable, dan maintainable!

**📅 Timeline:** 2-3 weeks (8-12 working days)

**👥 Team:** Development team + stakeholders

**📊 Status:** Planning phase complete, ready to execute!
