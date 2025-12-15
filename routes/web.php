<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminControllerDashboard;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotasController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalesNotesController;
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
        // Dashboard admin renderizar pagina admin
        Route::get('/dashboard', [AdminControllerDashboard::class, 'index'])->name('admin.dashboard');
        // Rutas para la gestión de usuarios
        Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
        Route::put('/usuarios/{user}', [UserController::class, 'update'])->name('usuarios.update');
        Route::patch('/usuarios/{user}/toggle', [UserController::class, 'toggleActive'])->name('usuarios.toggle');
        // Rutas para la gestión de productos
        Route::get('/productos', [ProductController::class, 'index'])->name('productos.index');
        Route::post('/productos', [ProductController::class, 'store'])->name('productos.store');
        Route::put('/productos/{product}', [ProductController::class, 'update'])->name('productos.update');
        Route::patch('/productos/{product}/toggle', [ProductController::class, 'toggleActive'])->name('productos.toggle');
        //reportes

        // ESTE ES EL PDF LISTO
        Route::get('/reportes/{tipo}/pdf', [ReportController::class, 'generarPDF'])
            ->name('reportes.pdf');


        // Rutas para la gestión de notas de venta
        Route::get('/notas', [SalesNotesController::class, 'index']);
        Route::get('/notas/{nota}', [SalesNotesController::class, 'show']);
        Route::post('/notas', [SalesNotesController::class, 'store']);
        Route::put('/notas/{nota}', [SalesNotesController::class, 'update']);
        Route::delete('/notas/{nota}', [SalesNotesController::class, 'destroy']);

    });
});



require __DIR__.'/auth.php';
