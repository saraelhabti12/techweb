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
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Quotation;
use App\Models\Client;


class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        // Get filter parameters
        $period = $request->get('period', 'all');
        $year = $request->get('year', date('Y'));
        $month = $request->get('month', 'all');
        $dayOfWeek = $request->get('day', 'all');
        $startDateParam = $request->get('start_date');
        $endDateParam = $request->get('end_date');
        $search = $request->get('search');
        
        $range = $this->getPeriodRange($period, $startDateParam, $endDateParam, $year, $month);
        $start = $range['start'];
        $end = $range['end'];

        // Helper to apply range and search to queries
        $applyFilters = function($query, $column = 'created_at', $searchColumn = 'title') use ($start, $end, $dayOfWeek, $search) {
            if ($start) {
                $query->where($column, '>=', $start);
            }
            if ($end) {
                $query->where($column, '<=', $end);
            }
            if ($dayOfWeek && $dayOfWeek !== 'all') {
                $days = [
                    'Sunday' => 1, 'Monday' => 2, 'Tuesday' => 3, 'Wednesday' => 4,
                    'Thursday' => 5, 'Friday' => 6, 'Saturday' => 7
                ];
                if (isset($days[$dayOfWeek])) {
                    $query->whereRaw("DAYOFWEEK($column) = ?", [$days[$dayOfWeek]]);
                }
            }
            if ($search) {
                $query->where($searchColumn, 'like', "%{$search}%");
            }
            return $query;
        };

        // Recent tasks with their projects (filtered by period and search)
        $recentTasks = $applyFilters(Task::query(), 'created_at', 'title')
            ->with('project')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'title', 'due_date', 'status', 'project_id']);

        // Recent projects (filtered by period and search)
        $recentProjects = $applyFilters(Project::query(), 'created_at', 'name')
            ->withCount('tasks')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'name', 'end_date']);

        // Task statistics (filtered by period only - search usually doesn't affect global stats unless intended)
        $applyRange = function($query, $column = 'created_at') use ($start, $end, $dayOfWeek) {
            if ($start) {
                $query->where($column, '>=', $start);
            }
            if ($end) {
                $query->where($column, '<=', $end);
            }
            if ($dayOfWeek && $dayOfWeek !== 'all') {
                $days = [
                    'Sunday' => 1, 'Monday' => 2, 'Tuesday' => 3, 'Wednesday' => 4,
                    'Thursday' => 5, 'Friday' => 6, 'Saturday' => 7
                ];
                if (isset($days[$dayOfWeek])) {
                    $query->whereRaw("DAYOFWEEK($column) = ?", [$days[$dayOfWeek]]);
                }
            }
            return $query;
        };

        $stats = [
            'total_tasks' => $applyRange(Task::query())->count(),
            'todo' => $applyRange(Task::query())->where('status', 'todo')->count(),
            'in_progress' => $applyRange(Task::query())->where('status', 'in_progress')->count(),
            'completed' => $applyRange(Task::query())->where('status', 'completed')->count(),
            'blocked' => $applyRange(Task::query())->where('status', 'blocked')->count(),
            'projects_count' => $applyRange(Project::query())->count(),
            'clients_count' => $applyRange(Client::query())->count(),
            'templates' => Template::count(),
        ];

        // Member task statistics (filtered by period)
        $membersStats = User::where('role', 'member')
            ->withCount([
                'tasks as total_tasks' => function ($query) use ($applyRange) {
                    $applyRange($query, 'tasks.created_at');
                },
                'tasks as todo_tasks' => function ($query) use ($applyRange) {
                    $applyRange($query, 'tasks.created_at')->where('status', 'todo');
                },
                'tasks as in_progress_tasks' => function ($query) use ($applyRange) {
                    $applyRange($query, 'tasks.created_at')->where('status', 'in_progress');
                },
                'tasks as completed_tasks' => function ($query) use ($applyRange) {
                    $applyRange($query, 'tasks.created_at')->where('status', 'completed');
                }
            ])
            ->get();

        // Dynamic task trend data
        $taskTrendData = [];
        if ($period === 'today' || $period === 'this_week' || ($dayOfWeek !== 'all')) {
            // Show last 7 days
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i);
                $count = Task::whereDate('created_at', $date)->count();
                $taskTrendData[] = [
                    'name' => $date->format('D'),
                    'tasks' => $count
                ];
            }
        } elseif ($period === 'this_month' || ($month !== 'all')) {
            // Show by weeks of the current/selected month
            $targetDate = Carbon::now();
            if ($year !== 'all') $targetDate->year((int)$year);
            if ($month !== 'all') $targetDate->month((int)$month);
            
            $monthStart = (clone $targetDate)->startOfMonth();
            $monthEnd = (clone $targetDate)->endOfMonth();
            $current = clone $monthStart;
            while ($current <= $monthEnd) {
                $weekEnd = (clone $current)->endOfWeek();
                if ($weekEnd > $monthEnd) $weekEnd = clone $monthEnd;
                $count = Task::whereBetween('created_at', [$current->startOfDay(), $weekEnd->endOfDay()])->count();
                $taskTrendData[] = [
                    'name' => 'W' . $current->weekOfMonth,
                    'tasks' => $count
                ];
                $current = $weekEnd->addDay();
            }
        } else {
            // Default: Show last 6 months
            for ($i = 5; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i);
                $count = Task::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                $taskTrendData[] = [
                    'name' => $date->format('M'),
                    'tasks' => $count
                ];
            }
        }

        // Upcoming deadlines
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

        // Recent team activity (filtered by period)
        $teamActivity = $applyRange(Task::query(), 'updated_at')
            ->with('user')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($task) {
                $action = $task->status === 'completed' ? 'completed' : 'updated';
                return [
                    'user' => $task->user ? $task->user->name : 'System',
                    'user_obj' => $task->user,
                    'action' => $action,
                    'item' => $task->title,
                    'time' => Carbon::parse($task->updated_at)->diffForHumans()
                ];
            })
            ->toArray();

        // Financial statistics (filtered by period)
        $financialStats = [
            'unpaid_invoices' => $applyRange(Invoice::where('status', '!=', 'paid'))->count(),
            'revenue_period' => $applyRange(Payment::query(), 'payment_date')->sum('amount'),
            'revenue_total' => Payment::sum('amount'), // Keep total for reference? Or filter it too?
            'quotations_pending' => $applyRange(Quotation::where('status', 'pending'))->count(),
        ];

        // Available years for filter
        $availableYears = Task::selectRaw('YEAR(created_at) as year')->distinct()->pluck('year')->sort()->values();
        if ($availableYears->isEmpty()) $availableYears = collect([date('Y')]);

        return Inertia::render('Admin/Dashboard', [
            'recentTasks' => $recentTasks,
            'recentProjects' => $recentProjects,
            'stats' => $stats,
            'financialStats' => $financialStats,
            'membersStats' => $membersStats,
            'taskTrendData' => $taskTrendData,
            'upcomingDeadlines' => $upcomingDeadlines,
            'teamActivity' => $teamActivity,
            'personalTodos' => Auth::user()->personalTodos()->latest()->get(),
            'filters' => [
                'period' => $period,
                'year' => $year,
                'month' => $month,
                'day' => $dayOfWeek,
                'start_date' => $startDateParam,
                'end_date' => $endDateParam,
                'search' => $search,
            ],
            'filterOptions' => [
                'years' => $availableYears,
                'months' => [
                    ['id' => 'all', 'name' => 'All Months'],
                    ['id' => 1, 'name' => 'January'],
                    ['id' => 2, 'name' => 'February'],
                    ['id' => 3, 'name' => 'March'],
                    ['id' => 4, 'name' => 'April'],
                    ['id' => 5, 'name' => 'May'],
                    ['id' => 6, 'name' => 'June'],
                    ['id' => 7, 'name' => 'July'],
                    ['id' => 8, 'name' => 'August'],
                    ['id' => 9, 'name' => 'September'],
                    ['id' => 10, 'name' => 'October'],
                    ['id' => 11, 'name' => 'November'],
                    ['id' => 12, 'name' => 'December'],
                ],
                'days' => ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            ]
        ]);
    }

    private function getPeriodRange($period, $startDate = null, $endDate = null, $year = null, $month = null)
    {
        $start = null;
        $end = null;

        if ($period === 'today') {
            $start = Carbon::today()->startOfDay();
            $end = Carbon::today()->endOfDay();
        } elseif ($period === 'this_week') {
            $start = Carbon::now()->startOfWeek();
            $end = Carbon::now()->endOfWeek();
        } elseif ($period === 'this_month') {
            $start = Carbon::now()->startOfMonth();
            $end = Carbon::now()->endOfMonth();
        } elseif ($period === 'this_year') {
            $start = Carbon::now()->startOfYear();
            $end = Carbon::now()->endOfYear();
        } elseif ($period === 'custom' && $startDate) {
            $start = Carbon::parse($startDate)->startOfDay();
            $end = $endDate ? Carbon::parse($endDate)->endOfDay() : Carbon::parse($startDate)->endOfDay();
        } elseif ($year !== 'all' || $month !== 'all') {
            $y = $year !== 'all' ? (int)$year : (int)date('Y');
            if ($month !== 'all') {
                $start = Carbon::create($y, (int)$month, 1)->startOfMonth();
                $end = Carbon::create($y, (int)$month, 1)->endOfMonth();
            } else {
                $start = Carbon::create($y, 1, 1)->startOfYear();
                $end = Carbon::create($y, 1, 1)->endOfYear();
            }
        }

        return ['start' => $start, 'end' => $end];
    }

}
