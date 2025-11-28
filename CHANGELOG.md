# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- PageContainer and PageSection components for consistent layout
- AI assistant documentation (CLAUDE.md, .claude/project.md)
- AI coding rules (.cursorrules, .clinerules)
- Comprehensive README updates
- This CHANGELOG file

### Changed
- Refactored all pages to use PageContainer component
- Updated CustomSelect component styling for better design system alignment
- Improved border colors and heights consistency across components

## [1.0.0] - 2025-11-29

### Added
- Laravel 12 base setup
- React 19 + TypeScript + Inertia.js frontend
- Spatie Media Library integration
- Spatie Permission (RBAC) system
- Spatie Activity Log with real-time broadcasting
- Laravel Reverb WebSocket server
- Dynamic menu management system
  - Drag & drop reordering
  - Nested menu support
  - Permission-based visibility
  - Icon picker (Lucide)
- Advanced file manager (Gallery)
  - Folder management (nested)
  - Public/Private file storage
  - Drag & drop upload
  - Image preview
- User management
  - CRUD operations
  - Soft delete & restore
  - Force delete
  - DataTables integration
- Role & Permission management
- App Settings (global configuration)
  - SEO settings
  - Theme colors (10 presets)
  - Contact info & social links
  - Maintenance mode
- Authentication system (Laravel Breeze)
  - Email/password login
  - Social login (Socialite)
  - Email verification
  - Password reset
- Dark/Light mode with system preference
- shadcn/ui component library (24 components)
- Real-time activity logging dashboard
- Server-side DataTables
- Confirmation dialogs
- Toast notifications
- Docker support (FrankenPHP)
- Comprehensive seeders
  - Roles & Permissions
  - Default users
  - Sample menus
  - App settings

### Development
- Vite 6.0 build tool
- TypeScript 5.7 with strict mode
- Tailwind CSS 4.0
- Laravel Pint for PHP formatting
- ESLint + Prettier for JS/TS formatting
- Pest testing framework
- Concurrent development script

### Security
- CSRF protection
- XSS prevention
- SQL injection prevention
- Permission-based access control
- Rate limiting
- Input validation

## Release Notes

### Version 1.0.0 - Initial Release

This is the first stable release of the Laravel 12 Spatie Media & Roles StarterKit.

**What's Included:**
- Complete authentication & authorization system
- Dynamic menu management with drag & drop
- Advanced file manager with folders
- Real-time activity logging via WebSocket
- User, Role, and Permission management
- Global app settings
- Dark/Light mode support
- Modern UI with shadcn/ui
- Docker support
- Production-ready

**Default Accounts:**
- Admin: admin@example.com / password
- User: user@example.com / password

**Tech Stack:**
- Laravel 12 + React 19 + TypeScript 5.7
- Inertia.js 2.0
- Tailwind CSS 4.0
- Spatie Media Library, Permission, Activity Log
- Laravel Reverb (WebSocket)

**Documentation:**
- README.md - Quick start guide
- CLAUDE.md - AI assistant quick reference
- .claude/project.md - Full project documentation

---

## Upgrading

### To 1.0.0 from pre-release

If upgrading from a pre-release version:

1. **Update Dependencies:**
   ```bash
   composer update
   npm update
   ```

2. **Run Migrations:**
   ```bash
   php artisan migrate
   ```

3. **Clear Caches:**
   ```bash
   php artisan optimize:clear
   ```

4. **Rebuild Frontend:**
   ```bash
   npm run build
   ```

5. **Update Environment:**
   Check `.env.example` for any new required variables.

---

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Support

For support and questions, please open an issue on GitHub.

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).
