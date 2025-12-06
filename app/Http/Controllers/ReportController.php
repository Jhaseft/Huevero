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
        $data = $this->getReporteDiario($date);
    
        // Generar PDF
        $pdf = Pdf::loadView('reportes.pdf', $data)->setPaper('a4', 'portrait');

        return $pdf->download("reporte-{$tipo}-{$date}.pdf");
    } else {
        abort(404, "Tipo de reporte no implementado");
    }
}
   private function getReporteDiario($date)
{
    $date = $date ? Carbon::parse($date)->toDateString() : Carbon::today()->toDateString();

    // Traer todas las ventas del día con cliente, usuario, items y método de pago
    $sales = SalesNote::with(['client.user', 'items.product', 'paymentMethod', 'payments.paymentMethod'])
        ->whereDate('date', $date)
        ->get();

    $reportePorUsuario = $sales->groupBy(fn($s) => $s->client->user->name)->map(function($notas, $usuario) {
        $totalUsuario = 0;
        $totalDeudaUsuario = 0;

        $notasFormateadas = $notas->map(function($nota) use (&$totalUsuario, &$totalDeudaUsuario) {
            $totalNota = $nota->total;

            $itemsFormateados = $nota->items->map(function($item) {
                return [
                    'producto' => $item->product->name,
                    'precio_unitario' => $item->unit_price,
                    'cantidad' => $item->quantity,
                    'subtotal' => $item->total,
                ];
            });

            $notaData = [
                'nota' => $nota->note_number,
                'cliente' => $nota->client->name,
                'metodo_pago_nota' => $nota->paymentMethod->name,
                'total_nota' => $totalNota,
                'items' => $itemsFormateados,
            ];

            // Solo si es crédito agregamos pagos, pagado y deuda
            if (strtolower($nota->paymentMethod->name) === 'credito') {
                $pagado = $nota->payments->sum('amount');
                $deuda = max($totalNota - $pagado, 0);
                $totalDeudaUsuario += $deuda;
                $totalUsuario += $pagado; // sumamos pagos de crédito al total vendido

                $pagosFormateados = $nota->payments->map(function($pago) {
                    return [
                        'monto' => $pago->amount,
                        'metodo_pago' => $pago->paymentMethod?->name,
                        'fecha' => $pago->payment_date,
                    ];
                });

                $notaData['pagado'] = $pagado;
                $notaData['deuda'] = $deuda;
                $notaData['pagos'] = $pagosFormateados;
            } else {
                // Contado o QR se considera venta directa
                $totalUsuario += $totalNota;
            }

            return $notaData;
        });

        return [
            'usuario' => $usuario,
            'total_vendido' => $totalUsuario,
            'total_deuda' => $totalDeudaUsuario,
            'notas' => $notasFormateadas,
        ];
    });

    // Resumen general
    $totalVendido = $reportePorUsuario->sum('total_vendido');
    $totalDeuda = $reportePorUsuario->sum('total_deuda');

    return [
        'titulo' => "Reporte Diario - $date",
        'fecha' => $date,
        'usuarios' => $reportePorUsuario,
        'resumen_general' => [
            'total_vendido' => $totalVendido,
            'total_deuda' => $totalDeuda,
        ]
    ];
}



}
