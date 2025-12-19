<?php

namespace App\Modules\Auth\Services\Api;

use App\Modules\Auth\DTOs\LoginDTO;
use App\Modules\Auth\DTOs\RegisterDTO;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class ApiAuthService
{
    public function login(LoginDTO $dto): array
    {
        $jwtToken = JWTAuth::attempt(['email' => $dto->email, 'password' => $dto->password]);
        if (!$jwtToken) {
            throw new \Exception('Invalid credentials');
        }

        return [
            'access_token' => $jwtToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ];
    }

    public function register(RegisterDTO $dto): array
    {
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
        ]);

        $accessToken = JWTAuth::fromUser($user);

        return [
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ];
    }
}
