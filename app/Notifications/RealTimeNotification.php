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

    // কনস্ট্রাক্টরের মাধ্যমে মেসেজটি রিসিভ করব
    public function __construct($message)
    {
        $this->message = $message;
    }

    // এখানে 'broadcast' চ্যানেলটি যুক্ত করতে হবে
    public function via(object $notifiable): array
    {
        return ['broadcast'];
    }

    // Pusher-এ কি ডাটা পাঠাবো তা এখানে ডিফাইন করা হয়
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'user_id' => $notifiable->id
        ]);
    }
}