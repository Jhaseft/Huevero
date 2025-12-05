<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_note_id',
        'amount',
        'previous_balance',
        'new_balance',
        'payment_date',
        'payment_type',
        'payment_method_id',
        'notes',
    ];

    public function salesNote()
    {
        return $this->belongsTo(SalesNote::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
