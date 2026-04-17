<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\Activity;
use App\Notifications\AppointmentStatusUpdated;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with(['client', 'user'])->latest()->get();

        return Inertia::render('Admin/Appointments/Index', [
            'appointments' => AppointmentResource::collection($appointments)->resolve(),
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $appointment->update($validated);

        // If accepted, add to schedules (Calendar)
        if ($validated['status'] === 'accepted') {
            Activity::log('Appointment Accepted', "Accepted appointment for: {$appointment->client->name}");
            Schedule::updateOrCreate(
                ['title' => 'Appointment: ' . $appointment->client->name],
                [
                    'date' => $appointment->appointment_date->format('Y-m-d'),
                    'time' => $appointment->appointment_date->format('H:i'),
                    'person' => $appointment->user->name,
                    'content' => 'Visit requested for client: ' . $appointment->client->name . '. Notes: ' . ($appointment->notes ?? 'None'),
                ]
            );
        }

        // Notify Member
        $appointment->user->notify(new AppointmentStatusUpdated($appointment));

        return back()->with('success', 'Appointment status updated to ' . $validated['status']);
    }

    public function calendar()
    {
        $appointments = Appointment::where('status', 'accepted')
            ->with(['client', 'user'])
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'title' => $appointment->client->name . ' (Visit)',
                    'start' => $appointment->appointment_date->toIso8601String(),
                    'extendedProps' => [
                        'member' => $appointment->user->name,
                        'client_phone' => $appointment->client->phone,
                        'notes' => $appointment->notes,
                    ],
                    'backgroundColor' => '#7c3aed', // Purple
                    'borderColor' => '#6d28d9',
                ];
            });

        return Inertia::render('Admin/Appointments/Calendar', [
            'events' => $appointments,
        ]);
    }
}
