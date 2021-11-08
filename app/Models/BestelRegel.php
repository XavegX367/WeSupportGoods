<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BestelRegel extends Model
{
    protected $table = 'bestellingregel';
    protected $primaryKey = 'BestelRegelId';
    public $timestamps = false;
    use HasFactory;
}
