<?php

namespace App\Repositories\Contracts;

interface AppSettingRepositoryInterface extends BaseRepositoryInterface
{
    public function getSingleton(): \App\Models\AppSetting;
}
