<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    /**
     * Return system health status.
     */
    public function __invoke(): JsonResponse
    {
        $databaseConnected = false;

        try {
            DB::connection()->getPdo();
            $databaseConnected = true;
        } catch (Throwable) {
            $databaseConnected = false;
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'AI Software Engineering Assistant API is running',
            'database' => $databaseConnected ? 'connected' : 'disconnected',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
