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
            'done' => $tasks->where('status', 'done')->count(),
        ];

        return Inertia::render('Member/Dashboard', [
            'tasks' => TaskResource::collection($tasks)->resolve(),
            'stats' => $stats,
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
        return inertia('Admin/Members/Create');
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
            'role' => 'required|string|in:admin,project_manager,member',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        // Optional: Send email
        // Mail::to($user->email)->send(new SendCredentials($user, $request->password));

        return redirect()->route('admin.members.index')->with('success', 'Member created successfully!');
    }

    public function show($id)
    {
        $member = User::findOrFail($id);
        return Inertia::render('Admin/Members/Show', ['member' => (new UserResource($member))->resolve()]);
    }

    public function edit($id)
    {
        $member = User::findOrFail($id);
        return Inertia::render('Admin/Members/Edit', [
            'member' => (new UserResource($member))->resolve(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|string|in:admin,project_manager,member',
        ]);

        $member = User::findOrFail($id);
        $member->name = $request->name;
        $member->email = $request->email;
        $member->role = $request->role;
        $member->save();

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

    public function showQrCode()
    {
        $user = auth()->user();
        $token = Str::random(40);
        $user->update(['attendance_token' => $token]);

        $attendanceUrl = route('member.attendance.mark', ['token' => $token]);

        $result = Builder::create()
            ->writer(new PngWriter())
            ->data($attendanceUrl)
            ->size(250)
            ->build();

        return response()->json([
            'qr' => base64_encode($result->getString()),
            'token' => $token
        ]);
    }

    public function mark($token)
    {
        $user = User::where('attendance_token', $token)->first();

        if (!$user) {
            return abort(404, 'Invalid token.');
        }

        $type = request()->input('type');
        $latitude = request()->input('latitude');
        $longitude = request()->input('longitude');

        if (!in_array($type, ['arrival', 'departure'])) {
            return redirect()->back()->with('error', 'Invalid attendance type.');
        }

        if (!$latitude || !$longitude) {
            return redirect()->back()->with('error', 'Location is required.');
        }

        $alreadyMarked = Attendance::where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->where('type', $type)
            ->exists();

        if ($alreadyMarked) {
            return Inertia::location(route('member.dashboard'));
        }

        $address = $this->reverseGeocode($latitude, $longitude);

        Attendance::create([
            'user_id' => $user->id,
            'type' => $type,
            'date' => now()->toDateString(),
            'marked_at' => now(),
            'latitude' => $latitude,
            'longitude' => $longitude,
            'location_address' => $address,
        ]);

        $user->update(['attendance_token' => Str::random(40)]);

        return Inertia::location(route('member.dashboard'));
    }

    private function reverseGeocode($latitude, $longitude)
    {
        try {
            $response = Http::get('https://nominatim.openstreetmap.org/reverse', [
                'format' => 'json',
                'lat' => $latitude,
                'lon' => $longitude,
                'zoom' => 18,
                'addressdetails' => 1
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['display_name'] ?? null;
            }
        } catch (\Exception $e) {
            \Log::error("Geocoding failed: " . $e->getMessage());
        }
        return null;
    }

    public function showMarkPage($token)
    {
        $user = User::where('attendance_token', $token)->first();

        if (!$user) {
            return abort(404, 'Invalid token.');
        }

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', Carbon::today())
            ->first();

        return Inertia::render('Member/Attendance/Mark', [
            'userName' => $user->name,
            'token' => $token,
            'attendance' => $attendance
        ]);
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
