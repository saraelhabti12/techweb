<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ImportantNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $notificationData) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Important Notification: ' . ($this->notificationData['title'] ?? 'ERP Update'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.important-notification',
        );
    }
}
