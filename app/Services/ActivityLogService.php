<?php

namespace App\Services;

use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use Spatie\Activitylog\Models\Activity;

class ActivityLogService
{
    /**
     * ActivityLogService constructor
     *
     * @param  ActivityLogRepositoryInterface  $activityLogRepository
     */
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository
    ) {}

    /**
     * Get latest activity logs
     *
     * @param  int  $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLatestLogs(int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return $this->activityLogRepository->getLatestWithCauser($limit);
    }

    /**
     * Get activity logs for specific subject
     *
     * @param  string  $subjectType
     * @param  int  $subjectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLogsForSubject(string $subjectType, int $subjectId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->activityLogRepository->getForSubject($subjectType, $subjectId);
    }

    /**
     * Get activity logs by causer (user)
     *
     * @param  int  $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLogsByUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->activityLogRepository->getByCauser($userId);
    }

    /**
     * Get activity logs by event type
     *
     * @param  string  $event
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLogsByEvent(string $event): \Illuminate\Database\Eloquent\Collection
    {
        return $this->activityLogRepository->getByEvent($event);
    }

    /**
     * Clear old activity logs
     *
     * @param  int  $daysToKeep
     * @return int Number of deleted records
     */
    public function clearOldLogs(int $daysToKeep = 30): int
    {
        return $this->activityLogRepository->clearOldLogs($daysToKeep);
    }

    /**
     * Get activity statistics
     *
     * @return array
     */
    public function getStatistics(): array
    {
        return $this->activityLogRepository->getStatistics();
    }

    /**
     * Log custom activity
     *
     * @param  string  $description
     * @param  string  $event
     * @param  array  $properties
     * @return Activity
     */
    public function logActivity(string $description, string $event = 'custom', array $properties = []): Activity
    {
        return activity()
            ->event($event)
            ->withProperties($properties)
            ->log($description);
    }
}
