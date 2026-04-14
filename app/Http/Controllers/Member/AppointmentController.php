<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\ClientResource;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\User;
use App\Notifications\AppointmentRequested;
use App\Mail\AppointmentRequestedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Auth::user()->appointments()->with('client')->latest()->get();

        return Inertia::render('Member/Appointments/Index', [
            'appointments' => AppointmentResource::collection($appointments)->resolve(),
        ]);
    }

    public function create(Request $request)
    {
        $clients = Auth::user()->clients()->get();

        return Inertia::render('Member/Appointments/Create', [
            'clients' => ClientResource::collection($clients)->resolve(),
            'client_id' => $request->query('client_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'appointment_date' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        // Authorization check: Does the client belong to the user?
        $client = Client::findOrFail($validated['client_id']);
        if ($client->user_id !== Auth::id()) {
            abort(403);
        }

        $appointment = Auth::user()->appointments()->create([
            'client_id' => $validated['client_id'],
            'appointment_date' => $validated['appointment_date'],
            'notes' => $validated['notes'],
            'status' => 'pending',
        ]);

        // Load relationships for notification
        $appointment->load(['client', 'user']);

        // Send Email to Admin
        try {
            Mail::to('techweb.ma@gmail.com')->send(new AppointmentRequestedMail($appointment));
        } catch (\Exception $e) {
            \Log::error('Failed to send appointment mail: ' . $e->getMessage());
        }

        // Notify Admins and Project Managers
        $admins = User::whereIn('role', ['admin', 'project_manager'])->get();
        try {
            \Illuminate\Support\Facades\Notification::send($admins, new AppointmentRequested($appointment));
        } catch (\Exception $e) {
            \Log::error('Failed to send appointment notification: ' . $e->getMessage());
        }

        return redirect()->route('member.appointments.index')->with('success', 'Appointment request sent to admin successfully!');
    }
}
