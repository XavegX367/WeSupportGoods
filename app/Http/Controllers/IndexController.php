<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Bestelling;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function Index(){
        if (Auth::check())
        {
            $result = null;
            if (Auth::user()->Rol == 'Picker') {
                $result = DB::table('bestelling')
                ->join('klant', 'klant.klantnummer', '=', 'bestelling.klantnummer')
                ->select('bestelling.*', 'klant.*')
                ->where('Afgerond', '=', '0')
                ->get();
            }
            elseif (Auth::user()->Rol == 'Verkoper'){
                $result = DB::table('bestelling')
                    ->join('klant', 'klant.klantnummer', '=', 'bestelling.klantnummer')
                    ->select('bestelling.*', 'klant.*')
                    ->get();
            }
            elseif (Auth::user()->Rol == 'Voorraadmanager'){
                $result = Artikel::all();
            }
            else
            {
                return response()->json(['error' => 'Not authorized.'],403);
            }
            return view('pages.main')->with('results', $result);
        }
        else
        {
            return view('auth.login');
        }
    }
}
