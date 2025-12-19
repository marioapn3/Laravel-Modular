<?php

namespace App\Modules\Auth\DTOs;

use App\Modules\Auth\Requests\RegisterRequest;

class RegisterDTO
{
    private function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
    ) {}

    public static function fromRequest(
        RegisterRequest $request
    ): self {
        return new self(
            name: $request->name,
            email: $request->email,
            password: $request->password,
        );
    }
}
