<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Models\Activity;
use App\Mail\TaskAssignedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;



use App\Traits\AdvancedFilterTrait;

class TaskController extends Controller
{
    use AdvancedFilterTrait;

    // public function index()
    // {
    //     $tasks = Task::with('project', 'user')->get();
    //     return inertia('Admin/Tasks/Index', compact('tasks'));
    // }

    public function index(Request $request)
    {
        $filters = $request->only(['year', 'month', 'day', 'week', 'period', 'search']);
        
        // Build query
        $query = Task::with(['project', 'user', 'files', 'members']);
        
        // Apply advanced filters
        $this->applyAdvancedFilters($query, $filters);
        
        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('project', function($projectQuery) use ($search) {
                      $projectQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $tasks = $query->latest()->get();

        return inertia('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $filters,
            'filterOptions' => $this->getFilterOptions()
        ]);
    }


    public function create()
    {
        $projects = Project::with('client')->get();
        $users = User::where('role', 'member')->get(); // Only members can be assigned tasks
        return inertia('Admin/Tasks/Create', compact('projects', 'users'));
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'due_date' => 'nullable|date',
    //         'deadline' => 'required|date|after_or_equal:due_date',
    //         'status' => 'required|in:todo,in_progress,done',
    //         'files.*' => 'nullable|file|max:10240', // max 10MB par fichier
    //         'project_id' => 'required|exists:projects,id',
    //         'assigned_to' => 'required|exists:users,id',
    //     ]);

    //      // 1. Créer la tâche sans les fichiers

    //     // $task = Task::create([
    //     //     'title' => $request->title,
    //     //     'description' => $request->description,
    //     //     'due_date' => $request->due_date,
    //     //     'deadline' => $request->deadline,
    //     //     'status' => $request->status,
    //     //     'project_id' => $request->project_id,
    //     //     'assigned_to' => $request->assigned_to,
    //     // ]);

    //     $task = Task::create($request->all());

    //      // 2. Gérer les fichiers uploadés
    // //     if ($request->hasFile('files')) {
    // //         foreach ($request->file('files') as $file) {
    // //             $path = $file->store('tasks'); // storage/app/tasks

    // //         // OPTION A: juste loger ou stocker le chemin dans une table à part
    // //         // OPTION B: créer une table `task_files` (recommandé si plusieurs fichiers par tâche)
    // //         // Exemple rapide si tu as TaskFile :
    // //         // $task->files()->create(['file_path' => $path]);
    // //     }
    // // }


    // // Gérer les fichiers uploadés
    // if($request->hasFile('files')){
    //     foreach($request->file('files') as $file){
    //         $path = $file->store('tasks'); // stockage dans storage/app/tasks
    //         $task->files()->create([
    //             'file_path' => $path,
    //             'original_name' => $file->getClientOriginalName(),
    //         ]);
    //     }
    // }

    // return redirect()->route('admin.tasks.index')->with('success', 'Task created successfully!');
    // }


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'deadline' => 'required|date|after_or_equal:due_date',
            'status' => 'required|in:todo,in_progress,completed,blocked',
            'files.*' => 'nullable|file|max:10240', // max 10MB par fichier
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'members' => 'required|array|min:1', 
            'members.*' => 'exists:users,id',
        ]);

        // 1. Créer la tâche
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'deadline' => $request->deadline,
            'status' => $request->status,
            'project_id' => $request->project_id,
            'assigned_to' => $request->assigned_to ?? ($request->members[0] ?? null),
        ]);

        Activity::log('Task Created', "Created task: {$task->title}");

        // 2. Gérer les fichiers uploadés
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // stocke le fichier dans storage/app/public/tasks
                $path = $file->store('tasks', 'public'); 
                $task->files()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        // Attacher les membres à la table pivot
        if ($request->filled('members')) {
            $task->members()->sync($request->members);
            
            // Notify members attached to the task
            $members = User::whereIn('id', $request->members)->get();
            \Illuminate\Support\Facades\Notification::send($members, new \App\Notifications\TaskAssigned($task));
        }
        
        // Notify the primary assigned user if not already in members
        if ($task->assigned_to && !in_array($task->assigned_to, $request->members)) {
            $task->user->notify(new \App\Notifications\TaskAssigned($task));
        }

        // Send Email to Admin (Requirement)
        try {
            Mail::to('techweb.ma@gmail.com')->send(new TaskAssignedMail($task));
        } catch (\Exception $e) {
            \Log::error('Failed to send task assigned mail to admin: ' . $e->getMessage());
        }

        return redirect()->route('admin.tasks.index')->with('success', 'Task created successfully!');
    }


    public function edit(Task $task)
    {
        $projects = Project::with('client')->get();
        $users = User::where('role', 'member')->get();
        return inertia('Admin/Tasks/Edit', compact('task', 'projects', 'users'));
    }

    // public function update(Request $request, Task $task)
    // {
    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'due_date' => 'nullable|date',
    //         'status' => 'required|in:todo,in_progress,done',
    //         'project_id' => 'required|exists:projects,id',
    //         'assigned_to' => 'required|exists:users,id',
    //         'files.*' => 'nullable|file|max:10240',
    //     ]);

    //     // $task->update($request->all());
    //     // Mettre à jour les champs
    //     $task->update($request->only([
    //         'title', 'description', 'due_date', 'deadline', 'status', 'project_id', 'assigned_to'
    //     ]));
    //     // Upload des fichiers
    //     if ($request->hasFile('files')) {
    //         foreach ($request->file('files') as $file) {
    //             $path = $file->store('tasks');
    //             $task->files()->create([
    //                 'file_path' => $path,
    //                 'original_name' => $file->getClientOriginalName(),
    //             ]);
    //         }
    //     }

    //     return redirect()->route('tasks.index')->with('success', 'Task updated successfully!');
    // }

    // public function update(Request $request, Task $task)
    //     {
    //         $request->validate([
    //             'title' => 'required|string|max:255',
    //             'description' => 'nullable|string',
    //             'due_date' => 'nullable|date',
    //             'deadline' => 'nullable|date|after_or_equal:due_date',
    //             'status' => 'required|in:todo,in_progress,done',
    //             'project_id' => 'required|exists:projects,id',
    //             'assigned_to' => 'required|exists:users,id',
    //             'files.*' => 'nullable|file|max:10240',
    //         ]);

    //         // Mettre à jour uniquement les champs existants
    //         $task->update($request->only([
    //             'title', 'description', 'due_date', 'deadline', 'status', 'project_id', 'assigned_to'
    //         ]));

    //         // Upload des fichiers
    //         if ($request->hasFile('files')) {
    //             foreach ($request->file('files') as $file) {
    //                 $path = $file->store('tasks');
    //                 $task->files()->create([
    //                     'file_path' => $path,
    //                     'original_name' => $file->getClientOriginalName(),
    //                 ]);
    //             }
    //         }

    //         return redirect()->route('tasks.index')->with('success', 'Task updated successfully!');
    //     }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'deadline' => 'nullable|date|after_or_equal:due_date',
            'status' => 'sometimes|in:todo,in_progress,completed,blocked',
            'project_id' => 'sometimes|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'members' => 'sometimes|array|min:1',
            'members.*' => 'exists:users,id',
            'files.*' => 'nullable|file|max:10240',
        ]);

        // ✅ Mettre à jour uniquement les champs envoyés
        $task->update($request->only([
            'title', 'description', 'due_date', 'deadline', 'status', 'project_id', 'assigned_to'
        ]));

        // Check if all tasks for the project are done to mark the project as completed
        if ($task->status === 'completed' && $task->project) {
            $totalTasks = $task->project->tasks()->count();
            $completedTasks = $task->project->tasks()->where('status', 'completed')->count();
            
            if ($totalTasks > 0 && $totalTasks === $completedTasks) {
                $task->project->update(['status' => 'completed']);
                Activity::log('Project Auto-Completed', "Project '{$task->project->name}' marked as completed because all tasks are done.");
            }
        }

        if ($request->has('members')) {
            $task->members()->sync($request->members);
            
            // If assigned_to is not in members and not explicitly provided, update it to the first member
            if (!$request->has('assigned_to') && !in_array($task->assigned_to, $request->members)) {
                $task->update(['assigned_to' => $request->members[0] ?? null]);
            }
        }

        // ✅ Gestion des fichiers multiples
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('tasks', 'public');
                $task->files()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return redirect()->route('admin.tasks.index')->with('success', 'Task updated successfully!');
    }



    public function show(Task $task)
    {
        $task->load(['project.client', 'user', 'progressUpdates.user', 'members', 'files']); 

        if (auth()->user()->role === 'admin' || auth()->user()->role === 'project_manager') {
            return inertia('Admin/Tasks/Show', [
                'task' => $task,
                'auth' => auth()->user(),
            ]);
        }

        return inertia('Member/Tasks/Progress', [
            'task' => $task,
            'auth' => auth()->user(),
        ]);
    }

    public function tasksIndex(Request $request)
    {
        $user = Auth::user();
        $filters = $request->only(['year', 'month', 'day', 'week', 'period', 'search']);

        $query = Task::with(['project.client', 'files', 'members'])
            ->withCount('progressUpdates')
            ->where(function($query) use ($user) {
                $query->where('assigned_to', $user->id)
                      ->orWhereHas('members', function($q) use ($user) {
                          $q->where('users.id', $user->id);
                      });
            });

        // Apply advanced filters
        $this->applyAdvancedFilters($query, $filters);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('project', function($projectQuery) use ($search) {
                      $projectQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $tasks = $query->latest()->get();

        return inertia('Member/Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $filters,
            'filterOptions' => $this->getFilterOptions()
        ]);
    }

public function showTaskProgress(Task $task)
{
    return inertia('Member/Tasks/Progress', [
        'auth' => [
            'user' => Auth::user(),
        ],
        'task' => $task->load(['project.client', 'progressUpdates.user', 'members', 'files']),
    ]);
}

    public function updateStatus(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:todo,in_progress,completed,blocked',
        ]);

        $oldStatus = $task->status;
        $task->update(['status' => $request->status]);

        Activity::log('Task Status Updated', "Updated task '{$task->title}' status from {$oldStatus} to {$request->status}");

        // Check if all tasks for the project are done to mark the project as completed
        if ($task->status === 'completed' && $task->project) {
            $totalTasks = $task->project->tasks()->count();
            $completedTasks = $task->project->tasks()->where('status', 'completed')->count();
            
            if ($totalTasks > 0 && $totalTasks === $completedTasks) {
                $task->project->update(['status' => 'completed']);
                Activity::log('Project Auto-Completed', "Project '{$task->project->name}' marked as completed because all tasks are done.");
            }
        }

        return back()->with('success', 'Task status updated successfully!');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('admin.tasks.index')->with('success', 'Task deleted successfully.');
    }

    public function showAdmin(Task $task)
{
    // Charger les relations nécessaires
    $task->load(['project', 'user', 'members', 'files']);

    return inertia('Admin/Tasks/Show', [
        'task' => $task,
        'auth' => auth()->user(),
    ]);
}
}

