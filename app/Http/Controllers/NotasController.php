<?php

namespace App\Http\Controllers;

use App\Models\SalesNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Client;

class NotasController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $notas = SalesNote::whereHas('client', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with(['client', 'items.product', 'payments.paymentMethod', 'paymentMethod'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'user' => $user,
            'notas' => $notas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'note_number' => 'required|string|max:50|unique:sales_notes,note_number',
            'client_id' => 'required|exists:clients,id',
            'date' => 'required|date',
            'total' => 'required|numeric',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $nota = SalesNote::create([
            'note_number' => $request->note_number,
            'client_id' => $request->client_id,
            'date' => $request->date,
            'total' => $request->total,
            'payment_method_id' => $request->payment_method_id,
        ]);

        foreach ($request->items as $item) {
            \App\Models\SalesNoteItem::create([
                'sales_note_id' => $nota->id,
                'product_id'    => $item['product_id'],
                'quantity'      => $item['quantity'],
                'unit_price'    => \App\Models\Product::find($item['product_id'])->unit_price,
                'total'         => \App\Models\Product::find($item['product_id'])->unit_price * $item['quantity']
            ]);
        }
 
        return response()->json([
            'success' => true,
            'nota' => $nota
        ]);
    }


    public function storeCliente(Request $request)
{
    $validated = $request->validate([
        'name'    => 'required|string|max:255',
        'phone'   => 'nullable|string|max:255',
        'address' => 'nullable|string|max:255',
    ]);

    // Crear cliente (sin user_id porque tus clientes no lo usan)
    $cliente = Client::create([
        'name'    => $validated['name'],
        'phone'   => $validated['phone'] ?? '',
        'address' => $validated['address'] ?? '',
        'user_id' => auth()->id() ?? null,
    ]);

    return response()->json($cliente);
}

    public function datosFormulario()
    {
        $user = Auth::user();

        return response()->json([
            'clientes' => \App\Models\Client::where('user_id', $user->id)->get(),
            'productos' => \App\Models\Product::where('active', 1)->get(),
            'metodos' => \App\Models\PaymentMethod::all(),
            'hoy' => now()->toDateString(),
        ]);
    }


}
