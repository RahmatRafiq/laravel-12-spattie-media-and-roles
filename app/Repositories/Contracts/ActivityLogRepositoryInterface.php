<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ActivityLogRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get latest activity logs with causer
     */
    public function getLatestWithCauser(int $limit = 50): Collection;

    /**
     * Get activity logs for specific subject
     */
    public function getForSubject(string $subjectType, int $subjectId): Collection;

    /**
     * Get activity logs by causer
     */
    public function getByCauser(int $causerId): Collection;

    /**
     * Get activity logs by event type
     */
    public function getByEvent(string $event): Collection;

    /**
     * Clear old activity logs
     *
     * @return int Number of deleted records
     */
    public function clearOldLogs(int $daysToKeep = 30): int;

    /**
     * Get activity statistics
     */
    public function getStatistics(): array;
}
