<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminControllerDashboard extends Controller
{
    /**
     * Página principal del panel admin con categorías y subcategorías
     */
    public function index(Request $request)
    {
        return Inertia::render('Admin/AdminDashboard');
    }

   
}
