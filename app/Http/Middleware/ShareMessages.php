<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contact;

class ShareMessages
{
    public function handle(Request $request, Closure $next)
    {
        Inertia::share([
            'messages' => Contact::orderBy('is_read')->latest()->get(),
            'unreadCount' => Contact::where('is_read', false)->count(),
        ]);

        return $next($request);
    }
}
