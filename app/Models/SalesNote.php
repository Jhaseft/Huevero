<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_number',
        'client_id',
        'date',
        'total',
        'payment_method_id',
    ];

    // Relación con Client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Relación con SalesNoteItems
    public function items()
    {
        return $this->hasMany(SalesNoteItem::class);
    }

    // Relación con Payments
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Relación con PaymentMethod
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
