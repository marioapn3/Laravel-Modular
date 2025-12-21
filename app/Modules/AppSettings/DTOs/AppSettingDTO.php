<?php

namespace App\Modules\AppSettings\DTOs;

use Illuminate\Http\UploadedFile;
use App\Modules\AppSettings\Requests\AppSettingRequest;

class AppSettingDTO
{
    private function __construct(
        public readonly string $app_name,
        public readonly ?UploadedFile $app_logo,
        public readonly ?UploadedFile $app_favicon,
    ) {}

    public static function fromRequest(AppSettingRequest $request): self
    {
        return new self(
            app_name: $request->validated('app_name'),
            app_logo: $request->file('app_logo'),
            app_favicon: $request->file('app_favicon'),
        );
    }
}
