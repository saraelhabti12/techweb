<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Attendance;
use Carbon\Carbon;

class ValidateAttendanceToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->route('token');
        $user = User::where('attendance_token', $token)->first();

        if (!$user || Auth::id() !== $user->id) {
            abort(403, 'Unauthorized access to token.');
        }

        // Check if attendance for today already exists
        $today = Carbon::today()->toDateString();
        $alreadyMarked = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->exists();

        if ($alreadyMarked) {
            abort(403, 'Attendance already marked for today.');
        }

        return $next($request);
    }
}

