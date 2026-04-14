<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AppointmentRequested extends Notification
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
            'title' => 'New Appointment Request',
            'message' => 'New appointment request for ' . $this->appointment->client->name . ' from ' . $this->appointment->user->name,
            'appointment_id' => $this->appointment->id,
            'client_name' => $this->appointment->client->name,
            'member_name' => $this->appointment->user->name,
            'date' => $this->appointment->appointment_date,
            'type' => 'appointment',
        ];
    }
}
