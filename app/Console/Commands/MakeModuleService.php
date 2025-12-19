<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleService extends Command
{
    protected $signature = 'make:module-service {module} {name} {--api}';

    protected $description = 'Create a new service for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $serviceName = Str::studly($this->argument('name'));
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $servicesPath = "{$modulePath}/Services";

        if (! File::exists($servicesPath)) {
            File::makeDirectory($servicesPath, recursive: true);
        }

        // Ensure service name ends with "Service"
        if (! str_ends_with($serviceName, 'Service')) {
            $serviceName .= 'Service';
        }

        $serviceFile = '';
        $namespace = "App\Modules\\{$moduleName}\Services";

        if ($this->option('api')) {
            $apiPath = "{$servicesPath}/Api";
            if (! File::exists($apiPath)) {
                File::makeDirectory($apiPath, recursive: true);
            }
            $serviceFile = "{$apiPath}/Api{$serviceName}.php";
            $namespace .= '\Api';
        } else {
            $webPath = "{$servicesPath}/Web";
            if (! File::exists($webPath)) {
                File::makeDirectory($webPath, recursive: true);
            }
            $serviceFile = "{$webPath}/{$serviceName}.php";
            $namespace .= '\Web';
        }

        if (File::exists($serviceFile)) {
            $this->error("Service {$serviceName} already exists in module {$moduleName}!");

            return self::FAILURE;
        }

        if ($this->option('api')) {
            $serviceContent = <<<PHP
<?php

namespace {$namespace};

class Api{$serviceName}
{
    //
}
PHP;
        } else {
            $serviceContent = <<<PHP
<?php

namespace {$namespace};

class {$serviceName}
{
    //
}
PHP;
        }


        File::put($serviceFile, $serviceContent);

        $this->info("Service {$serviceName} created successfully in module {$moduleName}!");

        return self::SUCCESS;
    }
}
