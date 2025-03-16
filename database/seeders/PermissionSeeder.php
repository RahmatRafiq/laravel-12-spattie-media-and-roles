<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Faker\Factory as Faker;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 100; $i++) {
            Permission::firstOrCreate([
                'name' => $faker->unique()->bs(), // Misal: "optimize seamless functionalities"
            ]);
        }
    }
}
