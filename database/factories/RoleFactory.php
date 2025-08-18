<?php

namespace Database\Factories;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word(),
            'guard_name' => 'web',
        ];
    }
}
