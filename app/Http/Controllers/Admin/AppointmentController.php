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
        $appointments = Appointment::where('status', '!=', 'manual')
            ->with(['client', 'user'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Appointments/Index', [
            'appointments' => AppointmentResource::collection($appointments)->resolve(),
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected',
            'end_date' => 'nullable|date',
            'type' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $updateData = ['status' => $validated['status']];
        if (isset($validated['end_date'])) $updateData['end_date'] = $validated['end_date'];
        if (isset($validated['type'])) $updateData['type'] = $validated['type'];
        if (isset($validated['notes'])) $updateData['notes'] = $validated['notes'];

        $appointment->update($updateData);

        // If accepted, add to schedules (Calendar)
        if ($validated['status'] === 'accepted') {
            // Set a default end_date if none exists (e.g., 1 hour after start)
            if (!$appointment->end_date) {
                $appointment->update([
                    'end_date' => (clone $appointment->appointment_date)->addHour(),
                ]);
            }

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
        $events = Appointment::where(function($query) {
                $query->where('status', 'accepted')
                      ->orWhere('status', 'manual');
            })
            ->with(['client', 'user'])
            ->get()
            ->map(fn($apt) => $apt->toCalendarEvent());

        return Inertia::render('Admin/Appointments/Calendar', [
            'events' => $events,
            'clients' => \App\Models\Client::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:client_meeting,internal_meeting,lunch_break,busy_outside,personal_event',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'notes' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
        ]);

        Appointment::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'appointment_date' => $validated['date'] . ' ' . $validated['start_time'],
            'end_date' => $validated['date'] . ' ' . $validated['end_time'],
            'notes' => $validated['notes'],
            'status' => 'manual',
            'user_id' => auth()->id(),
            'client_id' => $validated['client_id'] ?? null,
        ]);

        return back()->with('success', 'Event created successfully.');
    }
}
