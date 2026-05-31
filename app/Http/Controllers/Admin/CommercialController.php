<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commercial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CommercialController extends Controller
{
    public function index(Request $request)
    {
        $query = Commercial::with('projects')->latest();

        if ($request->filled('project')) {
            $search = $request->project;
            $query->whereHas('projects', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Commercials/Index', [
            'commercials' => $query->get(),
            'filters' => $request->only('project'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Commercials/Create', [
            'projects' => \App\Models\Project::active()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'photo' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
            'commission_type' => 'required|in:fixed,percentage',
            'commission_value' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'project_ids' => 'nullable|array',
            'project_ids.*' => 'exists:projects,id',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('commercials', 'public');
        }

        // Auto-link member account if email matches
        if ($validated['email']) {
            $user = \App\Models\User::where('email', $validated['email'])->first();
            if ($user) {
                $validated['user_id'] = $user->id;
            }
        }

        $commercial = Commercial::create($validated);

        if ($request->has('project_ids')) {
            $commercial->projects()->sync($request->project_ids);
        }

        return redirect()->route('admin.commercials.index')->with('success', 'Commercial created successfully.');
    }

    public function show(Commercial $commercial)
    {
        // Confirmed clients brought by this commercial (linked via projects)
        $clients = \App\Models\Client::whereHas('projects', function($q) use ($commercial) {
            $q->whereHas('commercials', function($cq) use ($commercial) {
                $cq->where('commercials.id', $commercial->id);
            });
        })->where('status', 'client')->distinct()->get();

        return Inertia::render('Admin/Commercials/Show', [
            'commercial' => $commercial->load(['projects.category', 'user']),
            'clients' => $clients,
        ]);
    }

    public function edit(Commercial $commercial)
    {
        return Inertia::render('Admin/Commercials/Edit', [
            'commercial' => $commercial->load('projects'),
            'projects' => \App\Models\Project::all(),
        ]);
    }

    public function update(Request $request, Commercial $commercial)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'photo' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
            'commission_type' => 'required|in:fixed,percentage',
            'commission_value' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'project_ids' => 'nullable|array',
            'project_ids.*' => 'exists:projects,id',
        ]);

        if ($request->hasFile('photo')) {
            if ($commercial->photo) {
                Storage::disk('public')->delete($commercial->photo);
            }
            $validated['photo'] = $request->file('photo')->store('commercials', 'public');
        }

        // Auto-link member account if email matches or changed
        if ($validated['email']) {
            $user = \App\Models\User::where('email', $validated['email'])->first();
            $validated['user_id'] = $user ? $user->id : null;
        } else {
            $validated['user_id'] = null;
        }

        $commercial->update($validated);

        if ($request->has('project_ids')) {
            $commercial->projects()->sync($request->project_ids);
        }

        return redirect()->route('admin.commercials.index')->with('success', 'Commercial updated successfully.');
    }

    public function destroy(Commercial $commercial)
    {
        if ($commercial->photo) {
            Storage::disk('public')->delete($commercial->photo);
        }
        $commercial->delete();

        return redirect()->route('admin.commercials.index')->with('success', 'Commercial deleted successfully.');
    }
}
