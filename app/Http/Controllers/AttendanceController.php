<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use App\Http\Resources\UserResource;

class AttendanceController extends Controller
{
    /**
     * Member: Smart Attendance Page
     */
    public function index()
    {
        $user = Auth::user();
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->first();

        return Inertia::render('Member/Attendance/SmartAttendance', [
            'auth' => [
                'user' => (new UserResource($user))->resolve()
            ],
            'todayAttendance' => $todayAttendance,
        ]);
    }

    /**
     * Member: Attendance History
     */
    public function myAttendance()
    {
        $user = Auth::user();
        $attendances = Attendance::where('user_id', $user->id)
            ->orderBy('marked_at', 'desc')
            ->get();

        return Inertia::render('Member/Attendance/MyAttendance', [
            'attendance' => $attendances,
        ]);
    }

    /**
     * Member: Generate/Get Dynamic QR Token
     */
    public function getQrCode()
    {
        $user = Auth::user();
        
        // Prevent generating QR if already marked today
        $alreadyMarked = Attendance::where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->exists();
            
        if ($alreadyMarked) {
            return response()->json(['error' => 'Already marked present today'], 403);
        }

        $token = Str::random(40);
        $user->update(['attendance_token' => $token]);

        $attendanceUrl = route('member.attendance.scan', ['token' => $token]);

        $result = Builder::create()
            ->writer(new PngWriter())
            ->data($attendanceUrl)
            ->size(300)
            ->margin(10)
            ->build();

        return response()->json([
            'qr' => base64_encode($result->getString()),
            'token' => $token
        ]);
    }

    /**
     * Universal: Scan and Mark Attendance
     */
    public function scan($token)
    {
        $user = User::where('attendance_token', $token)->first();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Invalid or expired QR code.');
        }

        $today = now()->toDateString();
        
        $alreadyMarked = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->exists();

        if ($alreadyMarked) {
            // If already marked, just redirect to success or dashboard
            return redirect()->route('member.dashboard')->with('info', 'You are already marked present today.');
        }

        Attendance::create([
            'user_id' => $user->id,
            'date' => $today,
            'type' => 'Check-In',
            'status' => 'present',
            'marked_at' => now(),
        ]);

        // Invalidate token
        $user->update(['attendance_token' => null]);

        return redirect()->route('member.dashboard')->with('success', 'Attendance marked successfully for today!');
    }

    /**
     * Admin: Attendance Dashboard
     */
    public function adminDashboard(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        
        $members = User::where('role', 'member')->get();
        $attendances = Attendance::whereDate('date', $date)->get();

        $attendanceData = $members->map(function ($member) use ($attendances, $date) {
            $attendance = $attendances->firstWhere('user_id', $member->id);
            
            return [
                'user_id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                'avatar' => $member->avatar,
                'date' => $date,
                'time' => $attendance ? Carbon::parse($attendance->marked_at)->format('H:i') : '--',
                'status' => $attendance ? 'Present' : 'Absent',
                'marked_at' => $attendance ? $attendance->marked_at : null,
            ];
        });

        $stats = [
            'total' => $members->count(),
            'present' => $attendances->count(),
            'absent' => $members->count() - $attendances->count(),
        ];

        // Live Feed (Last 10 logs across all days or just today?)
        // Let's do last 10 logs globally for "Live Feed"
        $liveFeed = Attendance::with('user')
            ->orderBy('marked_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($a) {
                return [
                    'id' => $a->id,
                    'user_name' => $a->user->name,
                    'time' => Carbon::parse($a->marked_at)->diffForHumans(),
                    'status' => 'marked present',
                ];
            });

        return Inertia::render('Admin/Attendance/Dashboard', [
            'attendanceData' => $attendanceData,
            'selectedDate' => $date,
            'stats' => $stats,
            'liveFeed' => $liveFeed,
        ]);
    }
}
