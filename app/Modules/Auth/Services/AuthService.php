<?php

namespace App\Modules\Auth\Services;

use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function login($request)
    {
        $email = $request->email;
        $password = $request->password;

        if (! $token = JWTAuth::attempt(['email' => $email, 'password' => $password])) {
            throw ValidationException::withMessages(['email' => ['Invalid credentials']]);
        }

        return [
            'token' => $token,
            'token_type' => 'bearer',
            'user' => JWTAuth::user(),
        ];
    }
}
