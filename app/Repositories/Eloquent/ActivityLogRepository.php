<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Activitylog\Models\Activity;

class ActivityLogRepository extends BaseRepository implements ActivityLogRepositoryInterface
{
    /**
     * ActivityLogRepository constructor
     */
    public function __construct(Activity $model)
    {
        parent::__construct($model);
    }

    /**
     * Get latest activity logs with causer
     */
    public function getLatestWithCauser(int $limit = 50): Collection
    {
        return $this->model->with('causer')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity logs for specific subject
     */
    public function getForSubject(string $subjectType, int $subjectId): Collection
    {
        return $this->model->where('subject_type', $subjectType)
            ->where('subject_id', $subjectId)
            ->with('causer')
            ->latest()
            ->get();
    }

    /**
     * Get activity logs by causer
     */
    public function getByCauser(int $causerId): Collection
    {
        return $this->model->where('causer_id', $causerId)
            ->latest()
            ->get();
    }

    /**
     * Get activity logs by event type
     */
    public function getByEvent(string $event): Collection
    {
        return $this->model->where('event', $event)
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
        return $this->model->where('created_at', '<', now()->subDays($daysToKeep))
            ->delete();
    }

    /**
     * Get activity statistics
     */
    public function getStatistics(): array
    {
        $totalLogs = $this->count();
        $recentLogs = $this->model->where('created_at', '>=', now()->subDay())->count();
        $uniqueCausers = $this->model->distinct('causer_id')->count('causer_id');

        $eventCounts = $this->model->selectRaw('event, COUNT(*) as count')
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
}
