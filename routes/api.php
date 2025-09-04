<?php
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Attendance;
use App\Models\AttendanceToken;

Route::post('/attendance/mark', function (Request $request) {
    $token = $request->input('token');

    $attendanceToken = AttendanceToken::where('token', $token)
        ->whereDate('date', Carbon::today())
        ->first();

    if (!$attendanceToken) {
        return response()->json(['message' => 'Invalid or expired token'], 404);
    }

    Attendance::updateOrCreate(
        ['user_id' => $attendanceToken->user_id, 'date' => Carbon::today()],
        ['status' => 'present']
    );

    $attendanceToken->delete();

    return response()->json(['message' => 'Attendance marked']);
});
