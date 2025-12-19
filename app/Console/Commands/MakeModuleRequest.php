<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleRequest extends Command
{
    protected $signature = 'make:module-request {module} {name} {--dto}';

    protected $description = 'Create a new form request for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $requestName = Str::studly($this->argument('name'));
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $requestsPath = "{$modulePath}/Requests";

        if (! File::exists($requestsPath)) {
            File::makeDirectory($requestsPath, recursive: true);
        }

        // Ensure request name ends with "Request"
        if (! str_ends_with($requestName, 'Request')) {
            $requestName .= 'Request';
        }

        $requestFile = "{$requestsPath}/{$requestName}.php";

        if (File::exists($requestFile)) {
            $this->error("Request {$requestName} already exists in module {$moduleName}!");

            return self::FAILURE;
        }

        $requestContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Requests;

use Illuminate\Foundation\Http\FormRequest;

class {$requestName} extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
PHP;

        File::put($requestFile, $requestContent);

        $this->info("Request {$requestName} created successfully in module {$moduleName}!");

        // Generate DTO if --dto flag is provided
        if ($this->option('dto')) {
            $this->createDTO($modulePath, $moduleName, $requestName);
        }

        return self::SUCCESS;
    }

    protected function createDTO(string $modulePath, string $moduleName, string $requestName): void
    {
        $dtosPath = "{$modulePath}/DTOs";

        if (! File::exists($dtosPath)) {
            File::makeDirectory($dtosPath, recursive: true);
        }

        // Convert request name to DTO name
        // StoreOrderRequest -> CreateOrderDTO
        // UpdateOrderRequest -> UpdateOrderDTO
        $dtoName = str_replace('Request', 'DTO', $requestName);
        if (! str_ends_with($dtoName, 'DTO')) {
            $dtoName .= 'DTO';
        }

        // Convert Store to Create for better naming convention
        if (str_starts_with($dtoName, 'Store')) {
            $dtoName = str_replace('Store', 'Create', $dtoName);
        }

        $dtoFile = "{$dtosPath}/{$dtoName}.php";

        if (File::exists($dtoFile)) {
            $this->warn("DTO {$dtoName} already exists in module {$moduleName}!");

            return;
        }

        $requestNamespace = "App\Modules\\{$moduleName}\Requests";
        $dtoContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\DTOs;

use {$requestNamespace}\\{$requestName};

class {$dtoName}
{
    private function __construct(
        // TODO: Add your DTO properties here
        // Example:
        // public readonly string \$productId,
        // public readonly int \$qty,
        // public readonly string \$userId,
        // public readonly ?string \$promoCode,
    ) {}

    public static function fromRequest(
        {$requestName} \$request
    ): self {
        return new self(
            // TODO: Map request properties to DTO properties
            // Example:
            // productId: \$request->product_id,
            // qty: \$request->qty,
            // userId: \$request->user()->id,
            // promoCode: \$request->promo_code,
        );
    }
}
PHP;

        File::put($dtoFile, $dtoContent);

        $this->info("DTO {$dtoName} created successfully in module {$moduleName}!");
    }
}
