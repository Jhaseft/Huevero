<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Listar todos los usuarios
    public function index(Request $request)
{
    $query = User::query();

    // Filtro por búsqueda
    if ($search = $request->input('search')) {
        $query->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
    }

    // Paginación
    $perPage = 5; // usuarios por página
    $users = $query->orderBy('id', 'desc')->paginate($perPage);

    return response()->json($users);
}

    // Editar usuario (nombre, email, contraseña)
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes','email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
        ]);

        $user->name = $request->name ?? $user->name;
        $user->email = $request->email ?? $user->email;

        if($request->password){
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json($user);
    }

    // Activar / Desactivar usuario
    public function toggleActive(User $user)
    {
        $user->active = !$user->active;
        $user->save();

        return response()->json(['active' => $user->active]);
    }
}
