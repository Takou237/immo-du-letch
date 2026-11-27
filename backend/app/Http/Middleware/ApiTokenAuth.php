<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiTokenAuth
{
    public function handle(Request $request, Closure $next, string $mode = 'required'): Response
    {
        $plain = $request->bearerToken();
        $user = null;

        if ($plain) {
            $token = ApiToken::with('user')
                ->where('token', hash('sha256', $plain))
                ->first();

            if ($token && $token->user && $token->user->is_active) {
                $token->forceFill(['last_used_at' => now()])->save();
                $user = $token->user;
            }
        }

        if ($mode === 'required' && !$user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        if ($user) {
            $request->setUserResolver(fn () => $user);
        }

        return $next($request);
    }
}
