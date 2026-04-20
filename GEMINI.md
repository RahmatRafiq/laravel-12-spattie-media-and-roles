# Project Mandates (Laravel 12 Spatie Media & Roles)

## Environment Isolation
- **HARGA MATI**: Selalu jalankan testing menggunakan environment `testing`.
- Perintah wajib: `php artisan test --env=testing` atau `php artisan <command> --env=testing`.
- Database testing menggunakan SQLite `:memory:` untuk kecepatan dan isolasi.

## Architectural Patterns
### Service Pattern
- Logika bisnis (Business Logic) wajib diletakkan di layer Service (`app/Services`).
- Controller hanya bertugas menangani request, validasi (jika sederhana), dan mengembalikan response.
- Media handling (Spatie Media Library) dibungkus di dalam Service layer atau menggunakan `App\Helpers\MediaLibrary` untuk operasi yang repetitif.

### Media Management
- Gunakan Spatie Media Library untuk semua penanganan file/media.
- Definisikan Media Collection di Model masing-masing.
- Gunakan `ProfilePhotoService` untuk manajemen foto profil user.

## Testing Standards
- Gunakan Pest untuk testing.
- Setiap fitur baru wajib disertai test yang mencakup:
    - Success cases.
    - Validation failures.
    - Unauthorized access (jika relevan).
