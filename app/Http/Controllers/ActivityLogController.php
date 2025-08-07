<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Ambil log terbaru dengan relasi causer (user yang melakukan aksi)
        $logs = Activity::with('causer')
            ->latest()
            ->limit(50)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'subject_type' => $activity->subject_type,
                    'subject_id' => $activity->subject_id,
                    'event' => $activity->event,
                    'causer_type' => $activity->causer_type,
                    'causer_id' => $activity->causer_id,
                    'properties' => $activity->properties,
                    'created_at' => $activity->created_at,
                    'causer_name' => $activity->causer ? $activity->causer->name : 'System',
                ];
            });

        return Inertia::render('ActivityLogList', [
            'initialLogs' => $logs,
        ]);
    }
}
