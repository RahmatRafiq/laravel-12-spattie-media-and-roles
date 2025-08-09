<?php
namespace App\Observers;

use App\Models\User;
use App\Notifications\AdminUserActivityNotification;
use Log;
use Spatie\Activitylog\Models\Activity;

class ActivityObserver
{
    public function created(Activity $activity)
    {
        if ($activity->subject_type !== User::class) {
            return;
        }

        Log::info("Activity for user recorded, id: " . $activity->id);

        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new AdminUserActivityNotification($activity));
        }
    }
}
