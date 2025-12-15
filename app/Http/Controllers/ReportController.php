<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalesNote;
use App\Models\Payment;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function daily(Request $request)
    {
        $date = $request->query('date')
            ? Carbon::parse($request->query('date'))->toDateString()
            : Carbon::today()->toDateString();

        $sales = SalesNote::with(['client.user', 'items.product'])
            ->whereDate('date', $date)
            ->get();

        $totalVendido = $sales->sum('total');

        $porCategoria = $sales->flatMap->items()
            ->groupBy(fn($item) => $item->product->category_code)
            ->map(fn($items) => [
                'cantidad' => $items->sum('quantity'),
                'total' => $items->sum('total'),
            ]);

        $porUsuario = $sales->groupBy(fn($s) => $s->client->user->name)
            ->map(fn($notas) => [
                'notas' => $notas->count(),
                'total' => $notas->sum('total'),
            ]);

        $pagos = Payment::with(['paymentMethod'])
            ->whereDate('payment_date', $date)
            ->get();

        $totalPagado = $pagos->sum('amount');

        $deuda = $sales->map(fn($n) =>
            max($n->total - $n->payments->sum('amount'), 0)
        )->sum();

        return response()->json([
            'fecha' => $date,
            'resumen' => [
                'total_vendido' => $totalVendido,
                'total_pagado'  => $totalPagado,
                'total_deuda'   => $deuda,
            ],
            'por_categoria' => $porCategoria,
            'por_usuario'   => $porUsuario,
            'ventas'        => $sales,
            'pagos'         => $pagos,
        ]);
    }

 public function generarPDF(Request $request, $tipo)
{
    $date = $request->query('date');

    if ($tipo === 'diario') {
        $data = $this->getReporteDiario($date); // Obtiene los datos para la vista

        // Generar PDF
        $pdf = Pdf::loadView('reportes.pdf', $data)
                  ->setPaper('a4', 'landscape'); // <-- Aquí defines tamaño y orientación

        return $pdf->download("reporte-{$tipo}-{$date}.pdf");
    } else {
        abort(404, "Tipo de reporte no implementado");
    }
}




private function getReporteDiario($date)
{
    $date = $date ? Carbon::parse($date)->toDateString() : Carbon::today()->toDateString();

    // Traer notas creadas hoy
    $notasHoy = SalesNote::with(['client.user', 'items.product', 'paymentMethod', 'payments.paymentMethod'])
        ->whereDate('date', $date)
        ->get();

    // Traer pagos realizados hoy (aunque la nota sea de otra fecha)
    $pagosHoy = Payment::with(['salesNote.client.user', 'salesNote.items.product', 'paymentMethod'])
        ->whereDate('payment_date', $date)
        ->get();

    // Combinar IDs de notas de hoy y notas que tuvieron pago hoy
    $notaIds = $notasHoy->pluck('id')->merge($pagosHoy->pluck('sales_note_id'))->unique();

    // Traer todas las notas relevantes
    $sales = SalesNote::with(['client.user', 'items.product', 'paymentMethod', 'payments.paymentMethod'])
        ->whereIn('id', $notaIds)
        ->get();

    // Columnas dinámicas
    $columnasProductos = $sales->flatMap(fn($s) => $s->items->map(fn($i) => $i->product->name))->unique()->values();
    $columnasMetodosPago = collect()
        ->merge($sales->map(fn($s) => $s->paymentMethod->name))
        ->merge($sales->flatMap(fn($s) => $s->payments->map(fn($p) => $p->paymentMethod?->name)))
        ->filter()->unique()->values();

    // Agrupar por usuario
    $reportePorUsuario = $sales->groupBy(fn($s) => $s->client->user->name)
        ->map(function($notas, $usuario) use ($columnasProductos, $columnasMetodosPago, $date) {
            $totalUsuario = 0;
            $totalDeudaUsuario = 0;

            $notasFormateadas = $notas->map(function($nota) use (&$totalUsuario, &$totalDeudaUsuario, $columnasProductos, $columnasMetodosPago, $date) {

                $productos = array_fill_keys($columnasProductos->toArray(), 0);
                $metodosPago = array_fill_keys($columnasMetodosPago->toArray(), 0);

                foreach ($nota->items as $item) {
                    $productos[$item->product->name] += (int) $item->quantity;
                }

                $metodoNota = strtolower($nota->paymentMethod->name);
                $totalNota = (float) $nota->total;

                // Pagos realizados hoy
                $pagadoHoy = (float) $nota->payments->where('payment_date', $date)->sum('amount');

                // Deuda pendiente hasta hoy (total - acumulado)
                $pagadoHastaHoy = (float) $nota->payments->where('payment_date', '<=', $date)->sum('amount');
                $deuda = max($totalNota - $pagadoHastaHoy, 0);

                if ($metodoNota === 'credito') {
                    $metodosPago['credito'] = $pagadoHoy;

                    foreach ($nota->payments as $pago) {
                        if ($pago->paymentMethod && $pago->payment_date == $date) {
                            $metodosPago[$pago->paymentMethod->name] += (float) $pago->amount;
                        }
                    }

                    $totalUsuario += $pagadoHoy;
                    $totalDeudaUsuario += $deuda;

                } else {
                    $metodosPago[$nota->paymentMethod->name] += $totalNota;
                    $totalUsuario += $totalNota;
                    $deuda = 0;
                }

                return [
                    'nota' => $nota->note_number,
                    'cliente' => $nota->client->name,
                    'productos' => $productos,
                    'metodos_pago' => $metodosPago,
                    'total_nota' => $totalNota,
                    'deuda' => $deuda,
                ];
            });

            return [
                'usuario' => $usuario,
                'total_vendido' => $totalUsuario,
                'total_deuda' => $totalDeudaUsuario,
                'notas' => $notasFormateadas,
            ];
        })->values();

    $totalVendido = $reportePorUsuario->sum('total_vendido');
    $totalDeuda = $reportePorUsuario->sum('total_deuda');

    return [
        'titulo' => "Reporte Diario - $date",
        'fecha' => $date,
        'productos' => $columnasProductos,
        'metodos_pago' => $columnasMetodosPago,
        'usuarios' => $reportePorUsuario,
        'resumen_general' => [
            'total_vendido' => $totalVendido,
            'total_deuda' => $totalDeuda,
        ]
    ];
}

}
