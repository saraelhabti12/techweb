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




class MemberController extends Controller
{
    public function index(): Response
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
            'tasks' => $tasks,
            'stats' => $stats,
        ]);
    }

    public function edit($id)
    {
        $member = User::findOrFail($id);

        return Inertia::render('Admin/Members/Edit', [
            'member' => $member,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        $member = User::findOrFail($id);
        $member->name = $request->name;
        $member->email = $request->email;
        $member->save();

        return redirect()->route('members.index')->with('success', 'Member updated successfully');
    }

    // Delete Member
    public function destroy($id)
    {
        $member = User::findOrFail($id);
        $member->delete();

        return redirect()->route('members.index')->with('success', 'Member deleted successfully');
    }





//show all member for admin


    public function indexAdmin()
    {
        $members = User::where('role', 'member')->get();
        return inertia('Admin/Members/Index', [
            'members' => $members,
        ]);
    }





    //create a new member for admin
    public function createAdmin()
    {
        return inertia('Admin/Members/Create');
    }




    //store the member

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
        ]);

        $password = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => 'member',
            'password' => Hash::make($password),
        ]);

        \Log::info("Sending email to: " . $user->email);
        Mail::to($user->email)->send(new SendCredentials($user, $password));

        return redirect()->route('members.index')->with('success', 'Member created and credentials sent!');
    }



    //show member details

    public function show($id)
{
    // Fetch the member details by their ID
    $member = User::findOrFail($id);

    // Return the view with the member details
    return Inertia::render('Admin/Members/Show', ['member' => $member]);

}




// attendance and qr code methods


public function showQrCode()
{
    $user = auth()->user();
    // Generate a permanent token for the user (store it if not exists)
    $token = $user->attendance_token ?? $this->generatePermanentTokenForUser($user);

    $attendanceUrl = route('attendance.mark', ['token' => $token]);

    $result = Builder::create()
        ->data($attendanceUrl)
        ->size(250)
        ->build();

    return response()->json([
        'qr' => base64_encode($result->getString())
    ]);
}

private function generatePermanentTokenForUser($user)
{
    $token = Str::random(40);

    $user->update([
        'attendance_token' => $token
    ]);

    return $token;
}

public function mark($token)
{
    $user = User::where('attendance_token', $token)->first();

    if (!$user) {
        return abort(404, 'Invalid token.');
    }

    $type = request()->input('type');
    $now = now();

    // Validate attendance type
    if (!in_array($type, ['arrival', 'departure'])) {
        return redirect()->back()->with('error', 'Invalid attendance type');
    }

    // Validate location
    if (!request()->has(['latitude', 'longitude'])) {
        return redirect()->back()->with('error', 'Location is required');
    }

    // Check if already marked this type today
    $alreadyMarked = Attendance::where('user_id', $user->id)
        ->whereDate('date', $now->toDateString())
        ->where('type', $type)
        ->exists();

    if ($alreadyMarked) {
        return Inertia::location(route('member.dashboard'));
    }

    // For departure, check if arrival was marked
    if ($type === 'departure') {
        $hasArrival = Attendance::where('user_id', $user->id)
            ->whereDate('date', $now->toDateString())
            ->where('type', 'arrival')
            ->exists();

        if (!$hasArrival) {
            return redirect()->back()->with('error', 'You must mark arrival before departure');
        }
    }

    // Optional: Reverse geocode to get address
    $address = $this->reverseGeocode(
        request()->latitude,
        request()->longitude
    );

    // Create attendance record
    Attendance::create([
        'user_id' => $user->id,
        'date' => $now->toDateString(),
        'type' => $type,
        'marked_at' => $now,
        'latitude' => request()->latitude,
        'longitude' => request()->longitude,
        'location_address' => $address
    ]);

    return Inertia::location(route('member.dashboard'));
}

// Optional: Add reverse geocoding method
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
        // Log error if needed
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

    // Check today's attendance
    $attendance = Attendance::where('user_id', $user->id)
        ->whereDate('date', Carbon::today())
        ->first();

    return Inertia::render('Member/Attendance/Mark', [
        'userName' => $user->name,
        'token' => $token,
        'attendance' => $attendance ? [
            'arrival_time' => $attendance->arrival_time,
            'departure_time' => $attendance->departure_time
        ] : null
    ]);
}









//storing a new member

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:member', // Make sure the role exists
        ]);

        $password = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => 'member',
            'password' => Hash::make($password),
        ]);

        // Send the email
        Mail::to($user->email)->send(new SendCredentials($user, $password));

        return redirect()->route('members.index')->with('success', 'Member created and email sent!');
    }







    public function generateTokenForUser($user)
{
    $today = now()->toDateString();

    // Generate or retrieve token for the day
    $token = AttendanceToken::firstOrCreate(
        ['user_id' => $user->id, 'date' => $today],
        ['token' => Str::random(32)] // Random 32-character token
    );

    return $token->token;
}




//tasks page for member

    public function tasksIndex(): Response
    {
        $tasks = Task::with('project')
            ->where('assigned_to', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Member/Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    public function showTaskProgress(Task $task)
    {


        return inertia('Member/Tasks/Progress', [
            'auth' => [
                'user' => Auth::user()
            ],
            'task' => $task->load('project', 'progressUpdates.user'),
        ]);
    }

}


