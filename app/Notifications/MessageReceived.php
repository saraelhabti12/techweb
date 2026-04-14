<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MessageReceived extends Notification
{
    use Queueable;

    public function __construct(public $msg) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $sender = $this->msg->sender ?? $this->msg->user;
        $senderName = $sender ? $sender->name : 'Someone';
        
        return [
            'title' => 'New Message',
            'message' => 'New message from ' . $senderName . ': ' . substr($this->msg->message, 0, 50) . '...',
            'sender_id' => $this->msg->sender_id ?? $this->msg->user_id,
            'type' => 'chat',
        ];
    }
}
