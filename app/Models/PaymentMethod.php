<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function salesNotes()
    {
        return $this->hasMany(SalesNote::class);
    }
}
