<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index(): Response
    {
        // Recent tasks with their projects
        $recentTasks = Task::with('project')
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get(['id', 'title', 'due_date', 'status', 'project_id']);

        // Recent projects with task count
        $recentProjects = Project::withCount('tasks')
            ->orderBy('end_date', 'asc')
            ->take(5)
            ->get(['id', 'name', 'end_date']);

        // Task statistics
        $stats = [
            'total_tasks' => Task::count(),
            'todo' => Task::where('status', 'todo')->count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'done' => Task::where('status', 'done')->count(),
        ];

        // Task trend data for the last 6 months
        $taskTrendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->format('M');
            $taskCount = Task::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $taskTrendData[] = [
                'name' => $monthName,
                'tasks' => $taskCount
            ];
        }

        // Upcoming deadlines (tasks due in next 7 days)
        $upcomingDeadlines = Task::whereBetween('due_date', [now(), now()->addDays(7)])
            ->orderBy('due_date', 'asc')
            ->take(3)
            ->get(['id', 'title', 'due_date'])
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'date' => Carbon::parse($task->due_date)->format('Y-m-d'),
                    'type' => 'task'
                ];
            })
            ->toArray();

        // Recent team activity (task updates)
        $teamActivity = Task::with('user')
            ->where('updated_at', '>=', now()->subDays(7))
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get(['id', 'title', 'status', 'updated_at', 'assigned_to'])
            ->map(function ($task) {
                $action = $task->status === 'done' ? 'completed' : 'updated';
                return [
                    'user' => $task->user ? $task->user->name : 'System',
                    'avatar' => $task->user ? substr($task->user->name, 0, 2) : 'SY',
                    'action' => $action,
                    'item' => $task->title,
                    'time' => Carbon::parse($task->updated_at)->diffForHumans()
                ];
            })
            ->toArray();

        return Inertia::render('Admin/Dashboard', [
            'recentTasks' => $recentTasks,
            'recentProjects' => $recentProjects,
            'stats' => $stats,
            'taskTrendData' => $taskTrendData,
            'upcomingDeadlines' => $upcomingDeadlines,
            'teamActivity' => $teamActivity,
        ]);
    }
}
