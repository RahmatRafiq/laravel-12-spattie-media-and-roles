<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ActivityLogCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $log;

    public function __construct($log)
    {
        $this->log = $log;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('activity-logs');
    }

    public function broadcastAs()
    {
        return 'ActivityLogCreated';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->log->id,
            'description' => $this->log->description ?? 'Unknown activity',
            'event' => $this->log->event ?? 'unknown',
            'causer_type' => $this->log->causer_type,
            'causer_id' => $this->log->causer_id,
            'causer_name' => $this->log->causer ? $this->log->causer->name : null,
            'subject_type' => $this->log->subject_type,
            'subject_id' => $this->log->subject_id,
            'properties' => $this->log->properties,
            'created_at' => $this->log->created_at,
        ];
    }
}
