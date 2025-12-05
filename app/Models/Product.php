<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_code',
        'unit_price',
        'active',
    ];

    public function salesNoteItems()
    {
        return $this->hasMany(SalesNoteItem::class);
    }
}
