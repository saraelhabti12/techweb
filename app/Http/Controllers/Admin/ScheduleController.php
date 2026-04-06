<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::query();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('person', 'like', "%{$search}%")
                ->orWhere('content', 'like', "%{$search}%");
        }

        $schedules = $query->latest()->get();

        return Inertia::render('Admin/Schedule/Index', [
            'schedules' => $schedules
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Schedule/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'person' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ]);

        Schedule::create($validated);
        
        return redirect()->route('admin.schedule.index')
                        ->with('success', 'Schedule added successfully.');
    }

    // public function calendar()
    // {
    //     $events = Schedule::all(['id', 'title', 'date as start']);
    //     return Inertia::render('Admin/Schedule/Calendar', [
    //         'events' => $events
    //     ]);
    // }



    // public function calendar()
    // {
    //     $events = Schedule::all()->map(function($schedule) {
    //         return [
    //             'id' => $schedule->id,
    //             'title' => $schedule->title,
    //             'start' => $schedule->date, // FullCalendar attend "start"
    //             'url' => route('admin.schedule.show', $schedule->id), // lien vers show
    //         ];
    //     });

    //     return Inertia::render('Admin/Schedule/Calendar', [
    //         // 'auth' => auth()->user(),
    //         'events' => $events
    //     ]);
    // }


    // public function calendar()
    // {
    //     $events = Schedule::all()->map(function($schedule) {
    //         return [
    //             'id' => $schedule->id,
    //             'title' => $schedule->title,
    //             'date' => $schedule->date,        // pour comparer avec selectedDate
    //             'time' => $schedule->time,        // pour l'affichage dans la table
    //             'person' => $schedule->person,    // pour l'affichage dans la table
    //             'content' => $schedule->content,  // optionnel si tu veux
    //             'url' => route('admin.schedule.show', $schedule->id),
    //         ];
    //     });

    //     return Inertia::render('Admin/Schedule/Calendar', [
    //         'events' => $events,
    //         'auth' => auth()->user(), // pour l’avatar
    //     ]);
    // }


    public function calendar()
    {
        $events = Schedule::all()->map(function($schedule) {
            // On crée une date complète au format ISO pour FullCalendar
            $date = $schedule->date ? $schedule->date->format('Y-m-d') : null;
            $time = $schedule->time ? $schedule->time->format('H:i:s') : null;

            return [
                'id' => $schedule->id,
                'title' => $schedule->title ?? '(Sans titre)',
                'start' => $time ? "{$date}T{$time}" : $date, // clé attendue par FullCalendar
                'url' => route('admin.schedule.show', $schedule->id),
                'allDay' => !$time, // affiche comme "all day" si pas d'heure
            ];
        });

        return Inertia::render('Admin/Schedule/Calendar', [
            'events' => $events,
            // 'auth' => auth()->user(),
        ]);
    }



    public function show(Schedule $schedule)
    {
        // Tu peux envoyer toutes les données nécessaires à la vue
        return Inertia::render('Admin/Schedule/Show', [
            'schedule' => $schedule
        ]);
    }

    // public function edit($id)
    // {
    //     $schedule = \App\Models\Schedule::findOrFail($id);
    //     return inertia('Admin/Schedule/Edit', [
    //         'schedule' => $schedule
    //     ]);
    // }


    public function edit($id)
    {
        $schedule = Schedule::findOrFail($id);

        // Séparer date et time proprement
        $date = null;
        $time = null;

        if ($schedule->date) {
            $dt = new \Carbon\Carbon($schedule->date);
            $date = $dt->format('Y-m-d'); // pour input type="date"
            $time = $dt->format('H:i');   // pour input type="time"
        }

        return inertia('Admin/Schedule/Edit', [
            'schedule' => [
                'id' => $schedule->id,
                'title' => $schedule->title,
                'date' => $date,
                'time' => $time,
                'person' => $schedule->person,
                'content' => $schedule->content,
            ],
            // 'auth' => auth()->user(),
        ]);
    }



    // public function update(Request $request, $id)
    // {
    //     $schedule = \App\Models\Schedule::findOrFail($id);

    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'date' => 'required|date',
    //         'person' => 'nullable|string|max:255',
    //         'content' => 'nullable|string',
    //     ]);

    //     $schedule->update([
    //         'title' => $request->title,
    //         'date' => $request->date,
    //         'person' => $request->person,
    //         'content' => $request->content,
    //     ]);

    //     return redirect()->route('admin.schedule.index')->with('success', 'Schedule updated successfully.');
    // }

    // public function update(Request $request, $id)
    // {
    //     $schedule = \App\Models\Schedule::findOrFail($id);

    //     $validated = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'date' => 'required|date',
    //         'time' => 'nullable|string',
    //         'person' => 'nullable|string|max:255',
    //         'content' => 'nullable|string',
    //     ]);

    //     // Combine la date et l'heure avant d'enregistrer
    //     $timePart = $validated['time'] ?? '00:00';
    //     $validated['date'] = $validated['date'] . ' ' . $timePart . ':00';
    //     unset($validated['time']);

    //     $schedule->update($validated);

    //     return redirect()->route('admin.schedule.index')
    //                     ->with('success', 'Schedule updated successfully.');
    // }


    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'person' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ]);

        $schedule->update($validated);

        return redirect()->route('admin.schedule.index')
                        ->with('success', 'Schedule updated successfully.');
    }


    public function destroy($id)
    {
        $schedule = \App\Models\Schedule::findOrFail($id);
        $schedule->delete();

        return redirect()->route('admin.schedule.index')->with('success', 'Schedule deleted successfully.');
    }


    public function dayView(Request $request)
    {
        $date = $request->query('date');

        $schedules = Schedule::whereDate('date', $date)
            ->orderBy('time')
            ->get();

        return Inertia::render('Admin/Schedule/DayView', [
            'schedules' => $schedules,
            'selectedDate' => $date,
            'auth' => auth()->user(),
        ]);
    }

}
