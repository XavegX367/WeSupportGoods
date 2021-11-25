<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Voorraad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoorraadController extends Controller
{
    public function GetVoorraad($id){
        $voorraad = DB::table('voorraad')
            ->where('artikelId', $id)
            ->get();

        return json_encode($voorraad);
    }

    public function SaveNewEenheid(Request $request){
        $voorraad = new Voorraad();
        $voorraad->artikelId = $request->id;
        $voorraad->Eenheid = $request->Eenheid;
        $voorraad->Aantal = $request->Aantal;
        $voorraad->Locatie = $request->Locatie;
        $voorraad->save();
        return 'OK';
    }

    public function SaveVoorraadEdit(Request $request) {
        Voorraad::where('voorraadId', $request->id)->update([
            'Aantal' => $request->Aantal,
            'Locatie' => $request->Locatie
        ]);
        return 'OK';
    }

    public function SaveNewProduct(Request $request) {
        $product = new Artikel();
        $product->Omschrijving = $request->Omschrijving;
        $product->Prijs = $request->Prijs;
        $product->save();
    }

    public function RefreshVoorraadTable() {
        $result = Artikel::all();
        return json_encode($result);
    }

    public function SaveArtikelEdit(Request $request){
        Artikel::where('Artikelnummer', $request->id)->update([
            'Omschrijving' => $request->Omschrijving,
            'Prijs' => $request->Prijs
        ]);
        return 'OK';
    }
}
