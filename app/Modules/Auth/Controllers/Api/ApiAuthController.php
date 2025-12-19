<?php

namespace App\Modules\Auth\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Auth\DTOs\LoginDTO;
use App\Modules\Auth\DTOs\RegisterDTO;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Services\Api\ApiAuthService;
use Illuminate\Http\JsonResponse;

class ApiAuthController extends Controller
{
    private  $apiAuthService;
    public function __construct(ApiAuthService $apiAuthService)
    {
        $this->apiAuthService = $apiAuthService;
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $dto = LoginDTO::fromRequest($request);
            $tokens = $this->apiAuthService->login($dto);
            return $this->success($tokens, 'Login successful');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $dto = RegisterDTO::fromRequest($request);
            $tokens = $this->apiAuthService->register($dto);
            return $this->success($tokens, 'Registration successful', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
