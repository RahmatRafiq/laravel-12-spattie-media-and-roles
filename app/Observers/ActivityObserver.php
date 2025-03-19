<?php
namespace App\Observers;

use App\Models\User;
use App\Notifications\AdminUserActivityNotification;
use Spatie\Activitylog\Models\Activity;

class ActivityObserver
{
    public function created(Activity $activity)
    {
        // Pastikan activity berasal dari model User
        if ($activity->subject_type !== User::class) {
            return;
        }

        // Mengirim notifikasi ke semua admin (sesuaikan logika pencarian admin dengan struktur aplikasi Anda)
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new AdminUserActivityNotification($activity));
        }
    }
}
