<?php

namespace App\Modules\Auth\DTOs;

use App\Modules\Auth\Requests\LoginRequest;

class LoginDTO
{
    private function __construct(
        public readonly string $email,
        public readonly string $password,
    ) {}

    public static function fromRequest(
        LoginRequest $request
    ): self {
        return new self(
            email: $request->email,
            password: $request->password,
        );
    }
}
