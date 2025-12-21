<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class Controller extends BaseController
{
    public function success($data = null, $message = 'Success', $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public function error($message = 'Error', $status = 400)
    {
        $status = ($status > 0 && $status < 600) ? $status : 400;

        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }

    public function notFound($message = 'Not Found', $status = 404)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }

    public function responseJson($data)
    {
        return response()->json($data);
    }

    public function inertiaRender($view, $data = [])
    {
        return Inertia::render($view, $data);
    }   
}
