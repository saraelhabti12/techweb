<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        if (!Auth::check()) {
            abort(403, 'Unauthorized. Please login.');
        }

        $user = Auth::user();

        // Admins, Project Managers and Commercials have elevated access to all roles' routes
        if (in_array($user->role, ['admin', 'project_manager', 'commercials'])) {
            return $next($request);
        }

        if (!in_array($user->role, $roles)) {
            abort(403, 'Unauthorized. Role required: ' . implode(', ', $roles));
        }

        return $next($request);
    }
}
