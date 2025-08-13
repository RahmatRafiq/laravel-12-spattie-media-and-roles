<?php

namespace Database\Factories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenuFactory extends Factory
{
    protected $model = Menu::class;

    public function definition()
    {
        return [
            'title' => $this->faker->word(),
            'route' => $this->faker->slug(),
            'icon' => 'icon-' . $this->faker->word(),
            'permission' => null,
            'parent_id' => null,
            'order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
