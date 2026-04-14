<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AppointmentStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Appointment ' . ucfirst($this->appointment->status),
            'message' => 'Your appointment request for ' . $this->appointment->client->name . ' was ' . $this->appointment->status,
            'appointment_id' => $this->appointment->id,
            'status' => $this->appointment->status,
            'type' => 'appointment',
        ];
    }
}
