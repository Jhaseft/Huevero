<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Mostrar todos los productos
    public function index(Request $request)
{
    $query = Product::query();

    if ($search = $request->query('search')) {
        $query->where('name', 'like', "%{$search}%")
              ->orWhere('category_code', 'like', "%{$search}%");
    }

    $products = $query->orderBy('id', 'desc')->paginate(10);

    return response()->json($products); // <-- Devuelve JSON
}

    // Guardar un producto nuevo
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_code' => 'required|string|max:50',
            'unit_price' => 'required|numeric|min:0',
        ]);

        Product::create([
            'name' => $request->name,
            'category_code' => $request->category_code,
            'unit_price' => $request->unit_price,
            'active' => 1,
        ]);

        return response()->json($product, 201);
    }

    // Actualizar un producto
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_code' => 'required|string|max:50',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $product->update($request->only('name', 'category_code', 'unit_price'));

        return response()->json($product);
    }

    // Activar / desactivar producto
    public function toggleActive(Product $product)
    {
        $product->active = !$product->active;
        $product->save();

        return response()->json($product);
    }
}
