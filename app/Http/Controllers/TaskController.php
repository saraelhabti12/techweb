<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;



class TaskController extends Controller
{
    // public function index()
    // {
    //     $tasks = Task::with('project', 'user')->get();
    //     return inertia('Admin/Tasks/Index', compact('tasks'));
    // }

    public function index(Request $request)
    {
        $search = $request->get('search');
        
        // Build query
        $query = Task::with(['project', 'user', 'files']);
        
        // Search filter
        if ($search) {
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
        
        $tasks = $query->get();

        return inertia('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }


    public function create()
    {
        $projects = Project::all();
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

    // return redirect()->route('tasks.index')->with('success', 'Task created successfully!');
    // }


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'deadline' => 'required|date|after_or_equal:due_date',
            'status' => 'required|in:todo,in_progress,done',
            'files.*' => 'nullable|file|max:10240', // max 10MB par fichier
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
            'members' => 'nullable|array', 
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
            'assigned_to' => $request->assigned_to,
        ]);

        // 2. Gérer les fichiers uploadés
        // if ($request->hasFile('files')) {
        //     foreach ($request->file('files') as $file) {
        //         $path = $file->store('tasks'); // storage/app/tasks
        //         $task->files()->create([
        //             'file_path' => $path,
        //             'original_name' => $file->getClientOriginalName(),
        //         ]);
        //     }
        // }

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

        // Attacher les membres dans la table pivot
        // if ($request->has('members') && is_array($request->members)) {
        //     $task->members()->sync($request->members);
        // }
        // if ($request->has('members')) {
        //     // S'assurer que c'est bien un tableau
        //     $members = is_array($request->members) ? $request->members : explode(',', $request->members);
        //     $task->members()->sync($members);
        // }

         // 2️⃣ Attacher les membres à la table pivot
        if ($request->filled('members')) {
            $task->members()->sync($request->members);
        }
        

        return redirect()->route('tasks.index')->with('success', 'Task created successfully!');
    }


    public function edit(Task $task)
    {
        $projects = Project::all();
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
            'status' => 'sometimes|in:todo,in_progress,done',
            'project_id' => 'sometimes|exists:projects,id',
            'assigned_to' => 'sometimes|exists:users,id',
            'files.*' => 'nullable|file|max:10240',
        ]);

        // ✅ Mettre à jour uniquement les champs envoyés
        $task->update($request->only([
            'title', 'description', 'due_date', 'deadline', 'status', 'project_id', 'assigned_to'
        ]));

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

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully!');
    }



    public function show(Task $task)
    {
        $task->load(['project', 'user', 'progressUpdates.user']); // eager load relationships

        return inertia('Member/Tasks/TaskProgress', [
            'task' => $task,
            'auth' => auth()->user(),
        ]);
    }

    public function tasksIndex()
    {
        $tasks = Task::with('project')
            ->where('assigned_to', Auth::id())
            ->latest()
            ->get();

        return inertia('Member/Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

public function showTaskProgress(Task $task)
{
    return inertia('Member/Tasks/Progress', [
        'auth' => [
            'user' => Auth::user(),
        ],
        'task' => $task->load('project', 'progressUpdates.user'),
    ]);
}

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
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

