<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Category;
use App\Models\Client;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;


use App\Traits\AdvancedFilterTrait;

class ProjectController extends Controller
{
    use AdvancedFilterTrait;

    public function index(Request $request)
    {
        // Get filter parameters
        $filters = $request->only(['year', 'month', 'day', 'week', 'period', 'search']);
        
        // Build base query with necessary relationships
        $query = Project::with(['category', 'members', 'client']);
        
        // Apply advanced filters
        $this->applyAdvancedFilters($query, $filters);
        
        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('category', function($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Get all filtered projects
        $projects = $query->latest()->get();
        
        // Separate projects into Active and Inactive
        $activeProjects = $projects->where('status', 'active')->values();
        $inactiveProjects = $projects->whereIn('status', ['completed', 'paused', 'cancelled', 'archived'])->values();
        
        return inertia('Admin/Projects/Index', [
            'activeProjects' => $activeProjects,
            'inactiveProjects' => $inactiveProjects,
            'filters' => $filters,
            'filterOptions' => $this->getFilterOptions()
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $clients = Client::where('is_blacklisted', false)->get(); 
        return inertia('Admin/Projects/Create', compact('categories', 'clients')); 
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'project_type' => 'required|in:Internal (Techweb),Client Project',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:active,completed,paused,cancelled,archived',
            'client_id' => 'required_if:project_type,Client Project|nullable|exists:clients,id',
        ]);

        if ($validatedData['project_type'] === 'Client Project' && $request->filled('client_id')) {
            $client = Client::find($request->client_id);
            if ($client) {
                $validatedData['client_name'] = $client->name;
                $validatedData['client_phone'] = $client->phone;
                $validatedData['client_email'] = $client->email;
                $validatedData['client_address'] = $client->address;
                $validatedData['client_city'] = $client->city;
                $validatedData['client_logo'] = $client->logo;
            }
        } else {
            $validatedData['client_id'] = null;
        }

        $project = Project::create($validatedData);
        Activity::log('Project Created', "Created project: {$project->name}");

        return redirect()->route('admin.projects.index');
    }

    public function edit(Project $project)
    {
        $categories = Category::all();
        $clients = Client::where('is_blacklisted', false)->get();
        return inertia('Admin/Projects/Edit', compact('project', 'categories', 'clients'));
    }

    public function update(Request $request, Project $project)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'project_type' => 'required|in:Internal (Techweb),Client Project',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:active,completed,paused,cancelled,archived',
            'client_id' => 'required_if:project_type,Client Project|nullable|exists:clients,id',
        ]);

        if ($validatedData['project_type'] === 'Client Project' && $request->filled('client_id')) {
            $client = Client::find($request->client_id);
            if ($client) {
                $validatedData['client_name'] = $client->name;
                $validatedData['client_phone'] = $client->phone;
                $validatedData['client_email'] = $client->email;
                $validatedData['client_address'] = $client->address;
                $validatedData['client_city'] = $client->city;
                $validatedData['client_logo'] = $client->logo;
            }
        } else {
            $validatedData['client_id'] = null;
            $validatedData['client_name'] = null;
            $validatedData['client_phone'] = null;
            $validatedData['client_email'] = null;
            $validatedData['client_address'] = null;
            $validatedData['client_city'] = null;
            $validatedData['client_logo'] = null;
        }

        $project->update($validatedData);

        return redirect()->route('admin.projects.index');
    }

    public function updateStatus(Request $request, Project $project)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,completed,paused,cancelled,archived'
        ]);

        $project->update($validated);

        Activity::log('Project Status Updated', "Updated status of project '{$project->name}' to '{$validated['status']}'");

        return back()->with('success', 'Project status updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('admin.projects.index');
    }

    public function show(Project $project)
    {
        $project->load([
            'category',
            'members',
            'tasks.user',      
            'tasks.members',
            'tasks.files',  
        ]);

        return inertia('Admin/Projects/Show', compact('project'));
    }

    public function clientHistory(Client $client)
    {
        $projects = $client->projects()->with('category')->latest()->get();
        
        $summary = [
            'total' => $projects->count(),
            'active' => $projects->where('status', 'active')->count(),
            'completed' => $projects->where('status', 'completed')->count(),
            'last_project_date' => $projects->first() ? $projects->first()->created_at->format('Y-m-d') : null,
        ];

        return response()->json([
            'projects' => $projects->map(function($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'status' => $project->status,
                    'created_at' => $project->created_at->format('Y-m-d'),
                    'end_date' => $project->end_date,
                    'category' => $project->category ? $project->category->name : 'N/A',
                ];
            }),
            'summary' => $summary
        ]);
    }
}
