<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('base/postman', function () {
    return Inertia::render('Base/Postman'); 
});
