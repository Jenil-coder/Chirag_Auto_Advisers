<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Debug Route - Remove later
    Route::get('/debug/users', function() {
        return \App\Models\User::all()->map(function($u) {
            return ['email' => $u->email, 'password' => $u->password];
        });
    });

    Route::get('/debug/force-reset', function() {
        $user = \App\Models\User::where('email', 'test@example.com')->first();
        if ($user) {
            // The 'hashed' cast in the model will automatically hash this string
            $user->password = 'password';
            $user->save();
            return "Password forcibly reset to 'password'. Please try logging in now.";
        }
        return "User not found.";
    });

    // Auth Routes
    Route::post('/auth/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [\App\Http\Controllers\ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('/auth/reset-password', [\App\Http\Controllers\ForgotPasswordController::class, 'reset']);
    
    // Settings
    Route::get('/settings', [\App\Http\Controllers\SettingController::class, 'index']);
    Route::put('/settings', [\App\Http\Controllers\SettingController::class, 'updateBatch']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
        Route::get('/auth/me', [\App\Http\Controllers\AuthController::class, 'me']);

        Route::apiResource('vehicles', \App\Http\Controllers\VehicleController::class);
        Route::post('vehicles/{vehicle}/documents', [\App\Http\Controllers\VehicleDocumentController::class, 'store']);
        Route::delete('vehicles/{vehicle}/documents/{document}', [\App\Http\Controllers\VehicleDocumentController::class, 'destroy']);

        // Master Data Routes
        Route::apiResource('vehicle-makes', \App\Http\Controllers\VehicleMakeController::class)->except(['show']);
        Route::apiResource('vehicle-classes', \App\Http\Controllers\VehicleClassController::class)->parameters([
            'vehicle-classes' => 'cls'
        ])->except(['show']);

        // Insurance Management Routes
        Route::get('insurance/expiring', [\App\Http\Controllers\InsuranceController::class, 'getExpiring']);
        Route::get('insurance/vehicle/{vehicleId}', [\App\Http\Controllers\InsuranceController::class, 'getVehicleDetailsForInsurance']);
        Route::get('vehicles/{vehicleId}/insurance', [\App\Http\Controllers\InsuranceController::class, 'getPoliciesByVehicle']);
        Route::apiResource('insurance', \App\Http\Controllers\InsuranceController::class);
        
        // Administration Routes
        Route::prefix('admin')->group(function () {
            Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'stats'])->middleware('permission:administration.view');
            
            Route::middleware('permission:administration.manage_users')->group(function () {
                Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'index']);
                Route::post('users', [\App\Http\Controllers\Admin\UserController::class, 'store']);
                Route::get('users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show']);
                Route::put('users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update']);
                Route::post('users/{user}/reset-password', [\App\Http\Controllers\Admin\UserController::class, 'resetPassword']);
            });
            
            Route::middleware('permission:administration.manage_roles')->group(function () {
                Route::get('roles', [\App\Http\Controllers\Admin\RoleController::class, 'index']);
                Route::put('roles/{role}/permissions', [\App\Http\Controllers\Admin\RoleController::class, 'updatePermissions']);
            });
            
            Route::middleware('permission:administration.view_audit')->group(function () {
                Route::get('audit', [\App\Http\Controllers\Admin\AuditController::class, 'index']);
                Route::get('audit/{id}', [\App\Http\Controllers\Admin\AuditController::class, 'show']);
            });
        });
    });
});
