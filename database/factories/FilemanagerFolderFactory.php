<?php

namespace Database\Factories;

use App\Models\FilemanagerFolder;
use Illuminate\Database\Eloquent\Factories\Factory;

class FilemanagerFolderFactory extends Factory
{
    protected $model = FilemanagerFolder::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'parent_id' => null,
            'path' => $this->faker->slug(),
        ];
    }
}
