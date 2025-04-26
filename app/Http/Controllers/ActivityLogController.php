<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Ambil log terbaru, misalnya 20 data terakhir
        $logs = Activity::latest()->take(20)->get();

        return Inertia::render('ActivityLogList', [
            'initialLogs' => $logs,
        ]);
    }
}
