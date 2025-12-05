<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\PaymentMethod;

class PaymentController extends Controller
{
    public function store(Request $request)
{
    $payment = Payment::create([
        'sales_note_id'   => $request->sales_note_id,
        'amount'          => $request->amount,
        'previous_balance'=> $request->previous_balance,
        'new_balance'     => $request->new_balance,
        'payment_date'    => $request->payment_date,
        'payment_type'    => $request->payment_type,
        'payment_method_id'=> $request->payment_method_id,
        'notes'           => $request->notes,
    ]);

    return response()->json($payment);
}

public function datosFormulario()
{
    try {
        $metodos = PaymentMethod::all(); // O el query que necesites
        return response()->json([
            'metodos' => $metodos
        ]);
    } catch (\Exception $e) {
        // Esto ayuda a debuggear
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}

}
