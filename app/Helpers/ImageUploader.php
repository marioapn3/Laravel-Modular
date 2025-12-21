<?php


namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class ImageUploader
{
    public static function upload($file, $path)
    {
        $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
        $filePath = $path . '/' . $fileName;
        Storage::disk('public')->put($filePath, file_get_contents($file));
        return $filePath;
    }

    public static function delete($path)
    {
        return Storage::disk('public')->delete($path);
    }

    public static function getUrl($path)
    {
        return Storage::disk('public')->path($path);
    }
}
