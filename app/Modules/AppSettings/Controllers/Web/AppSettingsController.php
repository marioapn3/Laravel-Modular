<?php

namespace App\Modules\AppSettings\Controllers\Web;

use App\Common\Enums\ViewEnums;
use App\Http\Controllers\Controller;

class AppSettingsController extends Controller
{
    public function index()
    {
        return $this->inertiaRender(ViewEnums::APP_SETTINGS_INDEX->value);
    }
}
