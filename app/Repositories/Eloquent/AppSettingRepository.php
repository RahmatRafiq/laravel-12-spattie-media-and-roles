<?php

namespace App\Repositories\Eloquent;

use App\Models\AppSetting;
use App\Repositories\Contracts\AppSettingRepositoryInterface;

class AppSettingRepository extends BaseRepository implements AppSettingRepositoryInterface
{
    public function __construct(AppSetting $model)
    {
        parent::__construct($model);
    }

    public function getSingleton(): AppSetting
    {
        return $this->model->firstOrCreate(
            ['id' => 1],
            [
                'app_name' => 'Laravel App',
                'primary_color' => '#3b82f6',
                'secondary_color' => '#6b7280',
                'accent_color' => '#10b981',
                'maintenance_mode' => false,
            ]
        );
    }
}
