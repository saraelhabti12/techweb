<?php



namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use inertia\inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // For members to view their own attendance
    public function myAttendance()
    {
        $user = Auth::user();

        $attendance = Attendance::where('user_id', $user->id)
            ->orderBy('marked_at', 'desc')
            ->get(['type', 'marked_at']);


            return inertia('Member/Attendance/MyAttendance', [
                'attendance' => $attendance,
            ]);
    }


    public function showMemberAttendance(Request $request)
    {
        $date = $request->input('date', now()->toDateString());

        // Get all members
        $members = User::where('role', 'member')->get();

        // Get attendances for that day
        $attendances = Attendance::whereDate('date', $date)->get();

        // Prepare data for display
        $attendanceData = $members->map(function ($member) use ($attendances, $date) {
            $attendance = $attendances->firstWhere('user_id', $member->id);


            $time = $attendance ? Carbon::parse($attendance->created_at)->format('H:i') : '--';


            $status = 'Absent';
    if ($attendance) {
        $status = $attendance->status ?? 'Present'; // or derive from attendance if you store 'Late' etc.
    }

            return [
                'user_id' => $member->id,
                'name' => $member->name,
                'date' => $date,
                'time' => $time,
               'status' => $status,

                'type' => optional($attendance)->type ?? '--',
            ];
        });

        return Inertia::render('Admin/Members/Attendance', [
            'auth' => ['user' => Auth::user()],
            'attendanceData' => $attendanceData,
            'selectedDate' => $date,
        ]);
    }




    // For admins to view all members' attendance
    public function index()
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('attendance.my');
        }

        $attendances = Attendance::with('member')
            ->orderBy('date', 'desc')
            ->paginate(15);

        return view('attendance.index', compact('attendances'));
    }

    // For admins to view a specific member's attendance
    public function memberAttendance(Member $member)
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('attendance.my');
        }

        $attendances = $member->attendances()
            ->orderBy('date', 'desc')
            ->paginate(15);

        return view('attendance.member', compact('attendances', 'member'));
    }

    public function create()
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('attendance.my');
        }

        $members = Member::all();
        return view('attendance.create', compact('members'));
    }

    public function store(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('attendance.my');
        }

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'date' => 'required|date',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i|after:time_in',
            'status' => 'required|in:present,absent,late,excused',
            'notes' => 'nullable|string|max:255',
        ]);

        Attendance::create($validated);

        return redirect()->route('attendance.index')
            ->with('success', 'Attendance record created successfully.');
    }

    public function edit(Attendance $attendance)
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('attendance.my');
        }

        $members = Member::all();
        return view('attendance.edit', compact('attendance', 'members'));
    }

    public function update(Request $request, Attendance $attendance)
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('attendance.my');
        }

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'date' => 'required|date',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i|after:time_in',
            'status' => 'required|in:present,absent,late,excused',
            'notes' => 'nullable|string|max:255',
        ]);

        $attendance->update($validated);

        return redirect()->route('attendance.index')
            ->with('success', 'Attendance record updated successfully.');
    }

    public function destroy(Attendance $attendance)
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('attendance.my');
        }

        $attendance->delete();

        return redirect()->route('attendance.index')
            ->with('success', 'Attendance record deleted successfully.');
    }

    // For members to check in/out
    public function checkIn()
    {
        $today = now()->toDateString();
        $attendance = Auth::user()->attendances()
            ->firstOrCreate(['date' => $today]);

        if (!$attendance->time_in) {
            $attendance->update([
                'time_in' => now()->toTimeString(),
                'status' => 'present'
            ]);
            return back()->with('success', 'Checked in successfully.');
        }

        return back()->with('error', 'You have already checked in today.');
    }

    public function checkOut()
    {
        $today = now()->toDateString();
        $attendance = Auth::user()->attendances()
            ->where('date', $today)
            ->first();

        if (!$attendance) {
            return back()->with('error', 'You need to check in first.');
        }

        if (!$attendance->time_out) {
            $attendance->update([
                'time_out' => now()->toTimeString()
            ]);
            return back()->with('success', 'Checked out successfully.');
        }

        return back()->with('error', 'You have already checked out today.');
    }
}
