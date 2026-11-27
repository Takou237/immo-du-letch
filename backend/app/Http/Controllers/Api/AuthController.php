<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:40'],
            'accountType' => ['nullable', 'in:particulier,professionnel'],
        ]);

        $user = User::create([
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'password' => $data['password'],
            'phone' => isset($data['phone']) && trim($data['phone']) !== '' ? trim($data['phone']) : null,
            'account_type' => $data['accountType'] ?? 'particulier',
            'provider' => 'email',
            'role' => 'user',
            'is_active' => true,
        ]);

        $token = $user->createApiToken();

        return response()->json([
            'user' => $user->toFrontendArray(),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower(trim($data['email'])))->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'E-mail ou mot de passe incorrect.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Ce compte a été désactivé par un administrateur.',
            ], 403);
        }

        $token = $user->createApiToken();

        return response()->json([
            'user' => $user->toFrontendArray(),
            'token' => $token,
        ]);
    }

    public function google(Request $request): JsonResponse
    {
        $data = $request->validate([
            'access_token' => ['required', 'string'],
        ]);

        $accessToken = $data['access_token'];
        $expectedClientId = config('services.google.client_id');

        if ($expectedClientId) {
            $tokenInfo = Http::timeout(10)->get('https://www.googleapis.com/oauth2/v3/tokeninfo', [
                'access_token' => $accessToken,
            ]);

            if (!$tokenInfo->ok()) {
                return response()->json([
                    'message' => 'Jeton Google invalide ou expiré.',
                ], 401);
            }

            $aud = $tokenInfo->json('aud') ?? $tokenInfo->json('azp');
            if ($aud !== $expectedClientId) {
                return response()->json([
                    'message' => 'Ce jeton Google ne correspond pas à cette application.',
                ], 401);
            }
        }

        $userInfo = Http::timeout(10)
            ->withToken($accessToken)
            ->get('https://www.googleapis.com/oauth2/v3/userinfo');

        if (!$userInfo->ok()) {
            return response()->json([
                'message' => 'Impossible de vérifier votre compte Google.',
            ], 401);
        }

        $profile = $userInfo->json();
        $email = isset($profile['email']) ? strtolower(trim((string) $profile['email'])) : '';
        $emailVerified = (bool) ($profile['email_verified'] ?? false);

        if ($email === '' || !$emailVerified) {
            return response()->json([
                'message' => 'Votre adresse e-mail Google doit être vérifiée.',
            ], 422);
        }

        $name = trim((string) ($profile['name'] ?? ''));
        if ($name === '') {
            $name = Str::before($email, '@');
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => Str::limit($name, 120, ''),
                'email' => $email,
                'password' => Str::random(32),
                'account_type' => 'particulier',
                'provider' => 'google',
                'role' => 'user',
                'is_active' => true,
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Ce compte a été désactivé par un administrateur.',
            ], 403);
        }

        $token = $user->createApiToken('google');

        return response()->json([
            'user' => $user->toFrontendArray(),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $plain = $request->bearerToken();
        if ($plain) {
            ApiToken::where('token', hash('sha256', $plain))->delete();
        }

        return response()->json(['ok' => true]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->toFrontendArray(),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'accountType' => ['required', 'in:particulier,professionnel'],
        ]);

        $user = $request->user();
        $user->update([
            'name' => trim($data['name']),
            'phone' => isset($data['phone']) && trim($data['phone']) !== '' ? trim($data['phone']) : null,
            'account_type' => $data['accountType'],
        ]);

        return response()->json([
            'user' => $user->fresh()->toFrontendArray(),
        ]);
    }
}
