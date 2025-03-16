<?php

namespace App\Models;

class Role extends \Spatie\Permission\Models\Role
{
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function user()
    {
        return $this->hasMany(User::class);
    }
}