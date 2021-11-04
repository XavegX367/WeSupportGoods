<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bestelling extends Model
{
    protected $table = 'bestelling';
    protected $primaryKey = 'Bestellingnummer';
    use HasFactory;
}
