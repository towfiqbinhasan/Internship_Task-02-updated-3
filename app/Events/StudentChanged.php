<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StudentChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $type;
    public $student;

    public function __construct($message, $type = 'success', $student = null)
    {
        $this->message = $message;
        $this->type = $type;
        $this->student = $student;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('student-tracker'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'student.changed';
    }
}