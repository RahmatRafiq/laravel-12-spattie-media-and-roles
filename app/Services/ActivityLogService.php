<?php

namespace App\Services;

use Spatie\Activitylog\Models\Activity;

class ActivityLogService
{
    /**
     * Get latest activity logs
     */
    public function getLatestLogs(int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return Activity::with('causer')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity logs for specific subject
     */
    public function getLogsForSubject(string $subjectType, int $subjectId): \Illuminate\Database\Eloquent\Collection
    {
        return Activity::where('subject_type', $subjectType)
            ->where('subject_id', $subjectId)
            ->with('causer')
            ->latest()
            ->get();
    }

    /**
     * Get activity logs by causer (user)
     */
    public function getLogsByUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Activity::where('causer_id', $userId)
            ->latest()
            ->get();
    }

    /**
     * Get activity logs by event type
     */
    public function getLogsByEvent(string $event): \Illuminate\Database\Eloquent\Collection
    {
        return Activity::where('event', $event)
            ->with('causer')
            ->latest()
            ->get();
    }

    /**
     * Clear old activity logs
     *
     * @return int Number of deleted records
     */
    public function clearOldLogs(int $daysToKeep = 30): int
    {
        return Activity::where('created_at', '<', now()->subDays($daysToKeep))
            ->delete();
    }

    /**
     * Get activity statistics
     */
    public function getStatistics(): array
    {
        $totalLogs = Activity::count();
        $recentLogs = Activity::where('created_at', '>=', now()->subDay())->count();
        $uniqueCausers = Activity::distinct('causer_id')->count('causer_id');

        $eventCounts = Activity::selectRaw('event, COUNT(*) as count')
            ->groupBy('event')
            ->pluck('count', 'event')
            ->toArray();

        return [
            'total_logs' => $totalLogs,
            'recent_logs_24h' => $recentLogs,
            'unique_causers' => $uniqueCausers,
            'events' => $eventCounts,
        ];
    }

    /**
     * Log custom activity
     */
    public function logActivity(string $description, string $event = 'custom', array $properties = []): Activity
    {
        return activity()
            ->event($event)
            ->withProperties($properties)
            ->log($description);
    }
}
