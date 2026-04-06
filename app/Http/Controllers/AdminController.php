<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth; // <-- ajoute ça en haut
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Contact;
use App\Models\Template;


class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        // Get filter parameters
        $year = $request->get('year');
        $month = $request->get('month');
        $day = $request->get('day');
        
        // Build date filter query
        $dateQuery = Task::query();
        
        if ($year) {
            $dateQuery->whereYear('created_at', $year);
        }
        if ($month) {
            $dateQuery->whereMonth('created_at', $month);
        }
        if ($day) {
            $dateQuery->whereDay('created_at', $day);
        }

        // Recent tasks with their projects (filtered by date)
        $recentTasks = (clone $dateQuery)->with('project')
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get(['id', 'title', 'due_date', 'status', 'project_id']);

        // Recent projects with task count
        $recentProjects = Project::withCount('tasks')
            ->orderBy('end_date', 'asc')
            ->take(5)
            ->get(['id', 'name', 'end_date']);

        // Task statistics (filtered by date)
        $stats = [
            'total_tasks' => (clone $dateQuery)->count(),
            'todo' => (clone $dateQuery)->where('status', 'todo')->count(),
            'in_progress' => (clone $dateQuery)->where('status', 'in_progress')->count(),
            'done' => (clone $dateQuery)->where('status', 'done')->count(),
            'templates' => Template::count(),
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

        // Upcoming deadlines (tasks due in next 7 days) - filtered by date
        $upcomingDeadlines = (clone $dateQuery)
            ->whereBetween('due_date', [now(), now()->addDays(7)])
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

        // Recent team activity (task updates) - filtered by date
        $teamActivity = (clone $dateQuery)
            ->with('user')
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
            'auth' => [
            'user' => Auth::user(), // <-- ajoute cette ligne
        ],
            'recentTasks' => $recentTasks,
            'recentProjects' => $recentProjects,
            'stats' => $stats,
            'taskTrendData' => $taskTrendData,
            'upcomingDeadlines' => $upcomingDeadlines,
            'teamActivity' => $teamActivity,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'day' => $day,
            ],

            // Ajout pour MessagesBell
            'messages' => Contact::latest()->get(),
            'unreadCount' => Contact::where('is_read', false)->count(),
        ]);
    }
}
