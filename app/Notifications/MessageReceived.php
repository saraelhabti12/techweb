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
        
        $content = $this->msg->message;
        if ($this->msg->type === 'image') {
            $content = '📷 Shared a photo';
        } elseif ($this->msg->type === 'file') {
            $content = '📁 Shared a file: ' . $this->msg->file_name;
        } else {
            $content = substr($content, 0, 50) . (strlen($content) > 50 ? '...' : '');
        }

        return [
            'title' => 'New Message',
            'message' => 'New message from ' . $senderName . ': ' . $content,
            'sender_id' => $this->msg->sender_id ?? $this->msg->user_id,
            'type' => 'chat',
        ];
    }
}
