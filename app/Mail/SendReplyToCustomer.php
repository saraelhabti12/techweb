<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendReplyToCustomer extends Mailable
{
    use Queueable, SerializesModels;

     public $body;

    /**
     * Create a new message instance.
     */
    public function __construct($body)
    {
        $this->body = $body;
    }
   

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new \Illuminate\Mail\Mailables\Address('Directeur@Techweb.Ma', 'Techweb'),
            subject: 'Reply from Techweb',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.reply', // ✅ remplace "view.name" par ton vrai fichier Blade
            with: ['body' => $this->body],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
