<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesNoteItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_note_id',
        'product_id',
        'quantity',
        'unit_price',
        'total',
    ];

    public function salesNote()
    {
        return $this->belongsTo(SalesNote::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
