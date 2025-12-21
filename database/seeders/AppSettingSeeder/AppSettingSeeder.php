<?php

namespace Database\Seeders\AppSettingSeeder;

use App\Helpers\ImageUploader;
use App\Modules\AppSettings\Models\AppSettings;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! AppSettings::exists()) {
            $baseUrl = env('APP_URL');

            $logoUrl = $baseUrl . '/images/logo/auth-logo.svg';
            $logoResponse = Http::get($logoUrl);
            $logoPath = '';

            if ($logoResponse !== null && $logoResponse->successful()) {
                $logoContent = $logoResponse->body();
                if ($logoContent !== null && $logoContent !== '') {
                    $logoPath = $this->storeImageFromContent($logoContent, 'svg', 'app-settings');
                }
            }

            // Download favicon image (using favicon.ico from public root)
            $faviconUrl = $baseUrl . '/favicon.ico';
            $faviconResponse = Http::get($faviconUrl);
            $faviconPath = $logoPath; // Default to logo path

            if ($faviconResponse !== null && $faviconResponse->successful()) {
                $faviconContent = $faviconResponse->body();
                if ($faviconContent !== null && $faviconContent !== '') {
                    $faviconPath = $this->storeImageFromContent($faviconContent, 'ico', 'app-settings');
                }
            }

            AppSettings::create([
                'app_name' => 'Laravel Boost',
                'app_logo' => $logoPath,
                'app_favicon' => $faviconPath,
            ]);
        }
    }

    /**
     * Store image from content using ImageUploader helper.
     */
    private function storeImageFromContent(string $content, string $extension, string $path): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'image_');
        file_put_contents($tempFile, $content);

        $uploadedFile = new UploadedFile(
            $tempFile,
            'image.' . $extension,
            'image/' . ($extension === 'svg' ? 'svg+xml' : $extension),
            null,
            true // test mode
        );

        $storedPath = ImageUploader::upload($uploadedFile, $path);

        @unlink($tempFile);

        return $storedPath;
    }
}

