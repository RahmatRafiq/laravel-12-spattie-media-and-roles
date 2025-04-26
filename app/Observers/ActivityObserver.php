<?php
namespace App\Observers;

use App\Models\User;
use App\Notifications\AdminUserActivityNotification;
use Spatie\Activitylog\Models\Activity;

class ActivityObserver
{
    public function created(Activity $activity)
    {
        if ($activity->subject_type !== User::class) {
            return;
        }

        \Log::info("Activity untuk user tercatat, id: " . $activity->id);

        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new AdminUserActivityNotification($activity));
        }
    }
}
