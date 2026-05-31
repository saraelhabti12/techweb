<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Fetch the latest activities.
     */
    public function index()
    {
        $user = auth()->user();
        $query = Activity::with('user:id,name,role');

        if ($user->role === 'admin' || $user->role === 'project_manager') {
            // Admins and Managers see actions performed by administrative staff
            $query->whereHas('user', function($q) {
                $q->whereIn('role', ['admin', 'project_manager']);
            });
        } else {
            // Members and others only see their own personal history
            $query->where('user_id', $user->id);
        }

        $activities = $query->latest()
            ->take(15)
            ->get();

        return response()->json($activities);
    }
}
