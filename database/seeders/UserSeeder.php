<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::all();

        User::factory(100)->create()->each(function ($user) use ($roles) {
            // Assign random role
            $user->assignRole($roles->random());
        });
    }
}
