<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminControllerDashboard;
use App\Http\Controllers\NotasController;
use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
    ]);
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

Route::middleware(['auth', 'verified'])->group(function () {

    // Traer todas las notas en JSON
    Route::get('/notas', [NotasController::class, 'index'])->name('notas.index.json');

    // Guardar nota vía fetch
    Route::post('/notas', [NotasController::class, 'store'])->name('notas.store.json');

    Route::post('/payments/store', [PaymentController::class, 'store'])->name('payments.store.json');
    Route::get('/metodos/datos-form', [PaymentController::class, 'datosFormulario']);
    
    Route::get('/notas/datos-form', [NotasController::class, 'datosFormulario']);
    Route::post('/clientes/store', [NotasController::class, 'storeCliente']);
});

Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login.post');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

    Route::middleware('auth:admin')->group(function () {

        Route::get('/dashboard', [AdminControllerDashboard::class, 'index']);

    });
});



require __DIR__.'/auth.php';
