<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Category;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // Get filter parameters
        $year = $request->get('year');
        $month = $request->get('month');
        $day = $request->get('day');
        $search = $request->get('search');
        
        // Build query
        $query = Project::with('category');
        
        // Date filters
        if ($year) {
            $query->whereYear('created_at', $year);
        }
        if ($month) {
            $query->whereMonth('created_at', $month);
        }
        if ($day) {
            $query->whereDay('created_at', $day);
        }
        
        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('category', function($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $projects = $query->get();
        
        return inertia('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'day' => $day,
                'search' => $search,
            ]
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $clients = Client::all(); // Fetch all clients
        return inertia('Admin/Projects/Create', compact('categories', 'clients')); // Pass clients to the view
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
            'status' => 'required|in:pending,in_progress,completed',
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

        Project::create($validatedData);

        return redirect()->route('admin.projects.index');
    }

    public function edit(Project $project)
    {
        $categories = Category::all();
        $clients = Client::all();
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
            'status' => 'required|in:pending,in_progress,completed',
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

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('admin.projects.index');
    }

    // public function show(Project $project)
    // {
    //     // Charger les relations pour afficher tous les détails
    //     // $project->load('category', 'tasks', 'members');

    //     // return Inertia::render('Admin/Projects/Show', [
    //     //     'project' => $project,
    //     // ]);

    // //     return inertia('Admin/Projects/Show', [
    // //     'project' => $project->load([
    // //         'category',     // catégorie du projet
    // //         'tasks.members', // membres de chaque tâche
    // //         'members'        // membres du projet
    // //     ])
    // // ]);
    // $project->load([
    //     'category',        // catégorie du projet
    //     'members',         // membres du projet
    //     'tasks.members',   // membres assignés à chaque tâche
    // ]);

    // return inertia('Admin/Projects/Show', compact('project'));
    // }

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

}
