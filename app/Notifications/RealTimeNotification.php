<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class RealTimeNotification extends Notification
{
    use Queueable;

    public $message;

   
    public function __construct($message)
    {
        $this->message = $message;
    }


    public function via(object $notifiable): array
    {
        return ['broadcast'];
    }

   
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'user_id' => $notifiable->id
        ]);
    }
}
