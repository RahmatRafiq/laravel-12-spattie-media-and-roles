# Laravel 12 Spatie Media & Roles StarterKit

An open-source starter kit built with **Laravel 12** to jumpstart your web development projects. This kit comes packed with powerful features including:

- **Spatie Roles & Permissions** – Robust user access control.
- **Spatie Media Library** – Seamless media management.
- **Dropzone JS** – Modern, user-friendly file uploads.
- **DataTables (from datatables.net)** – Advanced table features with server-side processing and soft delete support.

Built in just **29 hours over 3 days**, this starter kit is designed to help you hit the ground running!

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Database Setup & Seeders](#database-setup--seeders)
- [Media Library Usage](#media-library-usage)
- [DataTables Integration](#datatables-integration)
- [Running the Application](#running-the-application)
- [License](#license)

---

## Requirements

- PHP >= 8.0  
- Composer  
- Node.js & npm  
- A database (MySQL, PostgreSQL, etc.)

---

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/RahmatRafiq/laravel-12-spattie-media-and-roles.git
    cd laravel-12-spattie-media-and-roles
    ```

2. **Install PHP Dependencies**

    ```bash
    composer install
    ```

3. **Install Node Dependencies**

    ```bash
    npm install
    ```

4. **Environment Setup**

    Copy the `.env.example` file to create your own `.env` file:

    ```bash
    cp .env.example .env
    ```

    Then, update your `.env` file with your database and other configuration settings.

5. **Generate Application Key**

    ```bash
    php artisan key:generate
    ```

---

## Database Setup & Seeders

1. **Run Migrations**

    Migrate the database tables:

    ```bash
    php artisan migrate
    ```

2. **Run Seeders (Optional)**

    If you have seeders configured for roles, permissions, or test data, run:

    ```bash
    php artisan db:seed
    ```

    Note: Ensure your seeders are correctly configured to populate roles, permissions, and other necessary data.

---

## Media Library Usage

### Uploading a Profile Image

To upload a profile image, send a POST request to the upload endpoint with these fields:

- `profile-images.*`: Required file(s) (max size: 2MB; allowed types: jpeg, jpg, png)
- `id`: The user ID (integer)

Example controller method:

```php
public function upload(Request $request)
{
     $request->validate([
          'profile-images.*' => 'required|file|max:2048|mimes:jpeg,jpg,png',
          'id'               => 'required|integer',
     ]);

     $user = $request->user();
     $file = $request->file('profile-images')[0];
     $filePath = Storage::disk('temp')->putFile('', $file);
     $media = $user->addMediaFromDisk($filePath, 'temp')->toMediaCollection('profile-images');
     Storage::disk('temp')->delete($filePath);

     return response()->json([
            'name' => $media->file_name,
            'url'  => $media->getFullUrl()
     ], 200);
}
```

### Updating a User's Profile (Including Media)

Example controller method for updating a profile with media updates:

```php
public function update(ProfileUpdateRequest $request): RedirectResponse
{
     DB::beginTransaction();

     try {
          $request->validate([
                'profile-images' => 'array|max:3',
          ]);

          $user = $request->user();
          $user->fill($request->validated());

          if ($user->isDirty('email')) {
                $user->email_verified_at = null;
          }

          if ($request->has('profile-images')) {
                $profileImages = $request->input('profile-images');
                if (is_array($profileImages) && count($profileImages) > 0) {
                     $lastImage = end($profileImages);
                     $request->merge(['profile-images' => [$lastImage]]);
                }

                MediaLibrary::put(
                     $user,
                     'profile-images',
                     $request,
                     'profile-images'
                );
          }

          $user->save();
          DB::commit();
          return to_route('profile.edit');
     } catch (\Exception $e) {
          DB::rollBack();
          \Log::error('Profile update error: ' . $e->getMessage());
          return back()->withErrors(['error' => 'Profile update failed.']);
     }
}
```

---

## DataTables Integration

This starter kit comes with a custom `DataTableWrapper` component built on top of DataTables.net that supports server-side processing, custom action renderers, and soft delete features.

### Key Points:

- **Server-Side Pagination & Ordering**: DataTables is configured to work with Laravel's pagination.
- **Custom Render Functions**: Easily render action buttons (Edit, Delete, etc.) using custom render functions.
- **Reload API**: Use the `reload()` method provided by `DataTableWrapperRef` to refresh table data without a full page reload.

Example usage in a component:

```tsx
<DataTableWrapper
  ref={dtRef}
  ajax={{
     url: route('users.json') + '?filter=' + filter,
     type: 'POST',
  }}
  columns={columns(filter)}
  options={{ drawCallback }}
/>
```

Note: The JSON endpoint eagerly loads the roles relation to optimize queries.

---

## Running the Application

Start the Laravel development server:

```bash
php artisan serve
```

Then open your browser and navigate to `http://localhost:8000`.

For asset compilation during development, run:

```bash
npm run dev
```

---

## License

This project is open-source and available under the MIT License.