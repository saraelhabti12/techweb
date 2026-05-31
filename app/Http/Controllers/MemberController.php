<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendCredentials;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use App\Models\AttendanceToken;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Builder\Builder;
use Illuminate\Support\Facades\Storage;
use Endroid\QrCode\Writer\PngWriter;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;

class MemberController extends Controller
{
    /**
     * Member Dashboard (for members)
     */
    public function dashboard(): Response
    {
        $user = Auth::user();

        $tasks = Task::with('project')
            ->where('assigned_to', $user->id)
            ->latest()
            ->get();

        $stats = [
            'todo' => $tasks->where('status', 'todo')->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'completed' => $tasks->where('status', 'completed')->count(),
            'blocked' => $tasks->where('status', 'blocked')->count(),
        ];

        return Inertia::render('Member/Dashboard', [
            'tasks' => TaskResource::collection($tasks)->resolve(),
            'stats' => $stats,
            'personalTodos' => Auth::user()->personalTodos()->latest()->get(),
            'clients' => Auth::user()->clients()->latest()->take(5)->get(),
        ]);
    }

    /**
     * List all members (for admin)
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        $query = User::query();
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $members = $query->get();
        
        return inertia('Admin/Members/Index', [
            'members' => UserResource::collection($members)->resolve(),
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * Show create member form (for admin)
     */
    public function create()
    {
        return inertia('Admin/Members/Create', [
            'roles' => \Spatie\Permission\Models\Role::all(),
            'permissions' => \Spatie\Permission\Models\Permission::all(),
            'modules' => $this->getModules(),
        ]);
    }

    /**
     * Store a new member (for admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'array',
            'job_title' => 'nullable|string',
            'show_on_homepage' => 'boolean',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'job_title' => $request->job_title,
            'show_on_homepage' => $request->show_on_homepage,
        ];

        if ($request->hasFile('avatar')) {
            $userData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user = User::create($userData);

        $user->assignRole($request->role);
        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.members.index')->with('success', 'Member created successfully!');
    }

    public function show($id)
    {
        $member = User::findOrFail($id);
        $member->load('roles', 'permissions');
        return Inertia::render('Admin/Members/Show', [
            'member' => (new UserResource($member))->resolve(),
        ]);
    }

    public function edit($id)
    {
        $member = User::findOrFail($id);
        return Inertia::render('Admin/Members/Edit', [
            'member' => (new UserResource($member))->resolve(),
            'roles' => \Spatie\Permission\Models\Role::all(),
            'permissions' => \Spatie\Permission\Models\Permission::all(),
            'memberRoles' => $member->getRoleNames(),
            'memberPermissions' => $member->getPermissionNames(),
            'modules' => $this->getModules(),
        ]);
    }

    private function getModules()
    {
        return [
            'Dashboard',
            'Projects',
            'Tasks',
            'Clients',
            'Members',
            'Calendar',
            'Appointments',
            'Chat',
            'Finance',
            'Invoices',
            'Quotations',
            'Roles',
            'Creators',
            'Commercials',
            'Expenses',
            'Attendance',
            'History',
            'Contacts',
            'Notifications',
            'Settings',
            'Blogs',
            'Templates',
            'Categories',
            'TeamHub',
        ];
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'array',
            'job_title' => 'nullable|string',
            'show_on_homepage' => 'boolean',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $member = User::findOrFail($id);
        $member->name = $request->name;
        $member->email = $request->email;
        $member->role = $request->role;
        $member->job_title = $request->job_title;
        $member->show_on_homepage = $request->show_on_homepage;

        if ($request->hasFile('avatar')) {
            if ($member->avatar) {
                Storage::disk('public')->delete($member->avatar);
            }
            $member->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        if ($request->password) {
            $request->validate([
                'password' => 'required|string|min:8|confirmed',
            ]);
            $member->password = Hash::make($request->password);
        }

        $member->save();

        $member->syncRoles($request->role);
        $member->syncPermissions($request->permissions ?? []);

        return redirect()->route('admin.members.index')->with('success', 'Member updated successfully');
    }

    public function destroy($id)
    {
        $member = User::findOrFail($id);
        $member->delete();

        return redirect()->route('admin.members.index')->with('success', 'Member deleted successfully');
    }

    public function updateAvatar(Request $request, User $user)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return redirect()->route('admin.members.show', $user->id)
            ->with('success', 'Avatar updated successfully!');
    }

    public function tasksIndex(): Response
    {
        $tasks = Task::with('project')
            ->withCount('progressUpdates')
            ->where('assigned_to', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Member/Tasks/Index', [
            'tasks' => TaskResource::collection($tasks)->resolve(),
        ]);
    }

    public function showTaskProgress(Task $task)
    {
        return inertia('Member/Tasks/Progress', [
            'auth' => [
                'user' => (new UserResource(Auth::user()))->resolve()
            ],
            'task' => (new TaskResource($task->load('project', 'progressUpdates.user')))->resolve(),
        ]);
    }
}
