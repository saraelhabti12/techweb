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
        $activities = Activity::with('user:id,name')
            ->latest()
            ->take(15)
            ->get();

        return response()->json($activities);
    }
}
