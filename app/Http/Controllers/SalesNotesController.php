<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesNote;

class SalesNotesController extends Controller
{ 
   public function index(Request $request)
{
    $search = $request->query('search'); // Valor de búsqueda
    $startDate = $request->query('start_date'); // Fecha inicio
    $endDate = $request->query('end_date'); // Fecha fin
    $perPage = 10; // Número de registros por página

    $query = SalesNote::with(['client.user', 'items.product', 'payments.paymentMethod', 'paymentMethod'])
        ->orderBy('date', 'desc');

    // Filtrado por número de nota o nombre de cliente
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('note_number', 'like', "%{$search}%")
              ->orWhereHas('client', function ($qc) use ($search) {
                  $qc->where('name', 'like', "%{$search}%");
              });
        });
    }

    // Filtrado por rango de fechas
    if ($startDate && $endDate) {
        $query->whereBetween('date', [$startDate, $endDate]);
    } elseif ($startDate) {
        $query->where('date', '>=', $startDate);
    } elseif ($endDate) {
        $query->where('date', '<=', $endDate);
    }

    $notas = $query->paginate($perPage);

    return response()->json($notas);
}
   

    public function destroy(SalesNote $nota)
{
    // Eliminar items relacionados
    $nota->items()->delete();

    // Eliminar pagos relacionados
    $nota->payments()->delete();

    // Finalmente eliminar la nota
    $nota->delete();

    return response()->json(['message' => 'Nota eliminada correctamente']);
}
}
