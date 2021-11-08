<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voorraad extends Model
{
    protected $table = 'voorraad';
    protected $primaryKey = 'Eenheid';
    public $timestamps = false;
    use HasFactory;
}
