<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LeaveController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return Inertia::render('Member/Leave/Index', [
            'requests' => LeaveRequest::where('user_id', $user->id)->latest()->get(),
            'balance' => $user->leave_balance,
            'taken' => LeaveRequest::where('user_id', $user->id)->where('status', 'approved')->get()->sum(function($req) {
                return Carbon::parse($req->start_date)->diffInDays(Carbon::parse($req->end_date)) + 1;
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:vacation,sick_leave,remote_work,personal_day_off',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'attachment' => 'nullable|file|max:2048',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pending';

        if ($request->hasFile('attachment')) {
            $validated['attachment_path'] = $request->file('attachment')->store('leaves', 'public');
        }

        LeaveRequest::create($validated);

        return redirect()->back()->with('success', 'Demande de congé envoyée avec succès.');
    }
}
