<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ActivityLogRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get latest activity logs with causer
     *
     * @param  int  $limit
     * @return Collection
     */
    public function getLatestWithCauser(int $limit = 50): Collection;

    /**
     * Get activity logs for specific subject
     *
     * @param  string  $subjectType
     * @param  int  $subjectId
     * @return Collection
     */
    public function getForSubject(string $subjectType, int $subjectId): Collection;

    /**
     * Get activity logs by causer
     *
     * @param  int  $causerId
     * @return Collection
     */
    public function getByCauser(int $causerId): Collection;

    /**
     * Get activity logs by event type
     *
     * @param  string  $event
     * @return Collection
     */
    public function getByEvent(string $event): Collection;

    /**
     * Clear old activity logs
     *
     * @param  int  $daysToKeep
     * @return int Number of deleted records
     */
    public function clearOldLogs(int $daysToKeep = 30): int;

    /**
     * Get activity statistics
     *
     * @return array
     */
    public function getStatistics(): array;
}
