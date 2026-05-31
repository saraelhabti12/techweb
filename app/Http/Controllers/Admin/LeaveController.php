<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LeaveController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Leave/Index', [
            'requests' => LeaveRequest::with('user')->latest()->get(),
            'pending_count' => LeaveRequest::where('status', 'pending')->count()
        ]);
    }

    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_comment' => 'nullable|string',
        ]);

        $leaveRequest->update($validated);

        // If approved and it's a vacation/personal day, we might want to deduct from balance
        if ($validated['status'] === 'approved' && in_array($leaveRequest->type, ['vacation', 'personal_day_off'])) {
            $days = Carbon::parse($leaveRequest->start_date)->diffInDays(Carbon::parse($leaveRequest->end_date)) + 1;
            $user = $leaveRequest->user;
            $user->decrement('leave_balance', $days);
        }

        return redirect()->back()->with('success', 'Demande de congé mise à jour.');
    }
}
