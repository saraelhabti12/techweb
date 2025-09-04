<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('project', 'user')->get();
        return inertia('Admin/Tasks/Index', compact('tasks'));
    }

    public function create()
    {
        $projects = Project::all();
        $users = User::where('role', 'member')->get(); // Only members can be assigned tasks
        return inertia('Admin/Tasks/Create', compact('projects', 'users'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:todo,in_progress,done',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
        ]);

        Task::create($request->all());

        return redirect()->route('tasks.index');
    }

    public function edit(Task $task)
    {
        $projects = Project::all();
        $users = User::where('role', 'member')->get();
        return inertia('Admin/Tasks/Edit', compact('task', 'projects', 'users'));
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:todo,in_progress,done',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
        ]);

        $task->update($request->all());

        return redirect()->route('tasks.index');
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

        return redirect()->route('tasks.index');
    }
}

