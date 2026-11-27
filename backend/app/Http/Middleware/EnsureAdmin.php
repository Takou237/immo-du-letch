<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user || !$user->isAdmin() || !$user->is_active) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Accès réservé aux administrateurs.'], 403);
            }

            Auth::logout();
            return redirect()->route('admin.login');
        }

        return $next($request);
    }
}
