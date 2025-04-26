<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
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
        return new Channel('activity-logs');
    }
    

    public function broadcastWith()
    {
        return [
            'id'           => $this->log->id,
            'description'  => $this->log->description,
            'event'        => $this->log->event,
            'causer_id'    => $this->log->causer_id,
            'subject_type' => $this->log->subject_type,
            'created_at'   => $this->log->created_at,
        ];
    }
}
