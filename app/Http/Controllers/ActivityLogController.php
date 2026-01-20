<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    /**
     * ActivityLogController constructor
     *
     * @param  ActivityLogService  $activityLogService
     */
    public function __construct(
        private ActivityLogService $activityLogService
    ) {}

    /**
     * Display a listing of activity logs
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $logs = $this->activityLogService->getLatestLogs(50);

        return Inertia::render('ActivityLogList', [
            'initialLogs' => ActivityLogResource::collection($logs)->resolve(),
        ]);
    }
}
