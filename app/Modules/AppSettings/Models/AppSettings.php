<?php

namespace App\Modules\AppSettings\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSettings extends Model
{
    use HasFactory;

    protected $table = 'app_settings';

    protected $fillable = [
        'app_name',
        'app_logo',
        'app_favicon',
    ];

    // Accessor: app_logo
    public function getAppLogoAttribute($value)
    {
        return $value
            ? asset('storage/' . $value)
            : null;
    }

    // Accessor: app_favicon
    public function getAppFaviconAttribute($value)
    {
        return $value
            ? asset('storage/' . $value)
            : null;
    }
}
