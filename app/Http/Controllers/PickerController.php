<?php

namespace App\Http\Controllers;

use App\Models\Bestelling;
use App\Models\BestelRegel;
use App\Models\Voorraad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PickerController extends Controller
{
    public function GetOrderRows($id){
        $artikelen = DB::table('bestellingregel')
            ->join('artikel', 'artikel.artikelnummer', '=', 'bestellingregel.artikelnummer')
            ->join('voorraad', 'voorraad.eenheid', '=', 'bestellingregel.eenheid')
            ->where('bestellingnummer', '=', $id)
            ->select('bestellingregel.*', 'artikel.*', 'voorraad.locatie', 'voorraad.Aantal as inStock')
            ->get();
        return json_encode($artikelen);
    }

    public function PickProduct(Request $request){
        BestelRegel::where('BestelRegelId', $request->id)->update([
            'Picked' => 1
        ]);

        $aantal = Voorraad::where('Eenheid', $request->eenheid)->first();
        $newStock = $aantal->Aantal - $request->aantal;

        Voorraad::where('Eenheid', $request->eenheid)->update([
           'Aantal' => $newStock
        ]);
    }

    public function CompleteOrder(Request $request){
        Bestelling::where('Bestellingnummer', $request->id)->update([
            'Afgerond' => 1
        ]);
    }
}
