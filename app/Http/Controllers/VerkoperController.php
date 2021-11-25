<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Bestelling;
use App\Models\BestelRegel;
use App\Models\Klant;
use App\Models\Voorraad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VerkoperController extends Controller
{
    public function GetOrderRows($id){
        $artikelen = DB::table('bestellingregel')
            ->join('artikel', 'artikel.artikelnummer', '=', 'bestellingregel.artikelnummer')
            ->join('voorraad', function ($join) {
                $join->on('voorraad.eenheid', '=', 'bestellingregel.eenheid')->On('voorraad.artikelId', '=', 'bestellingregel.artikelnummer');
            })
            ->where('bestellingnummer', '=', $id)
            ->select('bestellingregel.*', 'artikel.*', 'voorraad.locatie', 'voorraad.Aantal as inStock', 'voorraad.artikelId as voorraadartikel')
            ->get();
        return json_encode($artikelen);
    }

    public  function SaveProduct(Request $request)
    {
        BestelRegel::where('BestelRegelId', $request->id)->update([
            'Aantal' => $request->Aantal,
            'Eenheid' => $request->Eenheid
        ]);
    }

    public function RemoveProduct(Request $request){
        BestelRegel::where('BestelRegelId', $request->id)->delete();
        return('succes');
    }

    public function SaveNewCustomer(Request $request)
    {
        $klant = new Klant();
        $klant->Bedrijfsnaam = $request->Bedrijfsnaam;
        $klant->Contactpersoon = $request->Contactpersoon;
        $klant->Email = $request->Email;
        $klant->Telefoonnummer = $request->Telefoonnummer;
        $klant->save();

        return('succes');
    }

    public function GetCustomers() {
        $customers = Klant::all();
        return json_encode($customers);
    }

    public function Getproducts() {
        $products = Artikel::all();
        return json_encode($products);
    }

    public function GetProductDetails($id) {
        $voorraad = DB::table('voorraad')
            ->where('artikelId', $id)
            ->get();

        return json_encode($voorraad);
    }

    public function SaveNewOrder(Request $request){
        $bestelling = new Bestelling();
        $bestelling->Klantnummer = $request->customer;
        $bestelling->Afgerond = 0;
        $bestelling->save();

        $bestellingregel = new BestelRegel();
        $bestellingregel->Bestellingnummer = Bestelling::where('Klantnummer', $request->customer)->max('Bestellingnummer');
        $bestellingregel->Artikelnummer = $request->product;
        $bestellingregel->Eenheid = $request->eenheid;
        $bestellingregel->Aantal = $request->aantal;
        $bestellingregel->Picked = 0;
        $bestellingregel->save();

        return('succes');
    }

    public function RefreshSellerTable() {
        $result = DB::table('bestelling')
            ->join('klant', 'klant.klantnummer', '=', 'bestelling.klantnummer')
            ->select('bestelling.*', 'klant.*')
            ->get();
        return($result);
    }

    public function LoadProductLocation($artikelnummer, $eenheid){
        $result = Voorraad::where('artikelId', $artikelnummer)->where('Eenheid', $eenheid)->get();

        return json_encode($result);
    }

    public function SaveNewProductLine(Request $request){
        $row = new BestelRegel();
        $row->Bestellingnummer = $request->Bestellingnummer;
        $row->Artikelnummer = $request->Artikelnummer;
        $row->Eenheid = $request->Eenheid;
        $row->Aantal = $request->Aantal;
        $row->Picked = 0;
        $row->save();

    }
}
