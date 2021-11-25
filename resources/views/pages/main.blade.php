@extends('layouts.app')

@section('content')
<!-- Begin Page Content -->
<div class="container-fluid">

    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">
            @if(\Illuminate\Support\Facades\Auth::user()->Rol == 'Picker')
                Bestellingen
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Verkoper')
                Bestellingen
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Voorraadmanager')
                Voorraad
            @endif
        </h1>
    </div>

    <!-- Content Row -->
    <div class="row">
        <div class="col-12">
            <!-- TODO Datatables toevoegen en hier gebruiken -->
            <!-- Picker Table -->
            @if(\Illuminate\Support\Facades\Auth::user()->Rol == 'Picker')
                <table id="PickerTable">
                    <thead>
                    <th>Nummer</th>
                    <th>Bedrijfsnaam</th>
                    <th>Contactpersoon</th>
                    <th>Actie</th>
                    </thead>
                    <tbody>
                        @foreach($results as $result)
                            <tr id="tr{{$result->Bestellingnummer}}">
                                <td>{{$result->Bestellingnummer}}</td>
                                <td>{{$result->Bedrijfsnaam}}</td>
                                <td>{{$result->Contactpersoon}}</td>
                                <td id="btnPicker{{$result->Bestellingnummer}}">
                                    @if($result->Afgerond == 1)
                                        <span style="color: lightgreen"><i class="fas fa-check"></i></span>
                                    @else
                                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#PickerModal" onclick="SendDataToModal({{$result->Bestellingnummer}}, '{{$result->Bedrijfsnaam}}')">Order Picken</button>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            <!-- Verkoper Table -->
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Verkoper')
                <div class="row">
                    <div class="col-sm-12">
                        <button data-toggle="modal" data-target="#NewOrderModal" class="btn btn-success" onclick="SendDataToNewOrderModal()"><i class="far fa-plus-square"></i> Nieuwe bestelling</button>
                        <button data-toggle="modal" data-target="#NewCustomerModal" class="btn btn-success"><i class="far fa-plus-square"></i> Nieuwe klant</button>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12">
                        <table id="VerkoperTable">
                            <thead>
                            <th>Nummer</th>
                            <th>Bedrijfsnaam</th>
                            <th>Contactpersoon</th>
                            <th>Actie</th>
                            </thead>
                            <tbody id="verkoperTableBody">
                                @foreach($results as $result)
                                    <tr id="tr{{$result->Bestellingnummer}}">
                                        <td>{{$result->Bestellingnummer}}</td>
                                        <td>{{$result->Bedrijfsnaam}}</td>
                                        <td>{{$result->Contactpersoon}}</td>
                                        <td id="btnPicker{{$result->Bestellingnummer}}">
                                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#VerkoperModal" onclick="SendDataToVerkoperModal({{$result->Bestellingnummer}}, '{{$result->Bedrijfsnaam}}', '{{$result->Contactpersoon}}', '{{$result->Telefoonnummer}}', '{{$result->Email}}')">Bekijken</button>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            <!-- Voorraad Table -->
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Voorraadmanager')
                <div class="row">
                    <div class="col-sm-12">
                        <button data-toggle="modal" data-target="#NewProductModal" class="btn btn-success"><i class="far fa-plus-square"></i> Nieuw Artikel</button>
                    </div>
                </div>
            <br>
                <table id="VoorraadTable">
                    <thead>
                    <th>Artikelnummer</th>
                    <th>Omschrijving</th>
                    <th>Prijs</th>
                    <th>Acties</th>
                    </thead>
                    <tbody id="voorraadTableBody">
                    @foreach($results as $result)
                        <tr>
                            <td>{{$result->Artikelnummer}}</td>
                            <td id="tdArtikelOmschrijving{{$result->Artikelnummer}}">{{$result->Omschrijving}}</td>
                            <td id="tdArtikelPrijs{{$result->Artikelnummer}}">€{{$result->Prijs}}</td>
                            <td id="tdArtikelButtons{{$result->Artikelnummer}}">
                                <button class="btn btn-success" onclick="EditArtikel({{$result->Artikelnummer}})" id="btnEditProductLine"><i class="fas fa-edit"></i></button>
                                <button type="button" data-toggle="modal" data-target="#VoorraadModal" class="btn btn-primary" id="btnWatchProduct" onclick="SendDataToVoorraadModal({{$result->Artikelnummer}}, '{{$result->Omschrijving}}')"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>
</div>

<!-- Picker Modal -->
<div class="modal fade" id="PickerModal" tabindex="-1" role="dialog" aria-labelledby="PickerModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="PickerModalLongTitle">Bestelling</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Bestellingnummer: <span id="PickerBestelNummer"></span><br>
                Bedrijfsnaam: <span id="PickerBedrijfsnaam"></span><br>
                <!-- TODO: Hier bestelgegevens inladen -->
                <table id="ArtikelPicker" class="table table-striped">
                    <thead>
                        <th>Artikel</th>
                        <th>Aantal</th>
                        <th>Eenheid</th>
                        <th>Locatie</th>
                        <th>Actie</th>
                    </thead>
                    <tbody id="tbodyPicker"></tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Sluiten</button>
                <button type="button" id="btnFinish" disabled class="btn btn-success">Afronden</button>
            </div>
        </div>
    </div>
</div>

<!-- Verkoper Modal -->
<div class="modal fade" id="VerkoperModal" tabindex="-1" role="dialog" aria-labelledby="VerkoperModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="VerkoperModalLongTitle">Bestelling</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-9"></div>
                    <div class="col-sm-3">
                        <button onclick="AddNewProductToOrder()" class="btn btn-success"><i class="far fa-plus-square"></i> Artikel toevoegen</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        Bestellingnummer: <span id="VerkoperBestelNummer"></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        Bedrijfsnaam: <span id="VerkoperBedrijfsnaam"></span>
                    </div>
                    <div class="col-6">
                        Contactpersoon: <span id="VerkoperContactpersoon"></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        Telefoon: <span id="VerkoperTelefoon"></span>
                    </div>
                    <div class="col-6">
                        Email: <span id="VerkoperEmail"></span>
                    </div>
                </div>
                <table id="ArtikelVerkoper" class="table table-striped">
                    <thead>
                    <th>Artikel</th>
                    <th>Aantal</th>
                    <th>Eenheid</th>
                    <th>Locatie</th>
                    <th>Acties</th>
                    </thead>
                    <tbody id="tbodyVerkoper"></tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Sluiten</button>
            </div>
        </div>
    </div>
</div>

<!-- Nieuwe bestelling Modal -->
<div class="modal fade" id="NewOrderModal" tabindex="-1" role="dialog" aria-labelledby="NewOrderModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="NewOrderModalLongTitle">Nieuwe bestelling</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- TODO: Body maken voor nieuwe bestelling! -->
                <div class="row">
                    <div class="col-sm-12">
                        Selecteer klant
                        <select onchange="loadOrderData()" class="form-control" id="selectCustomer">
                        </select>
                    </div>
                </div>

                <div hidden id="rowSelectProduct" class="row mt-2">
                    <div class="col-12">
                        Selecteer een product
                        <select  id="selectProduct" class="form-control" onchange="LoadProductDetails()">

                        </select>
                    </div>
                </div>

                <div hidden class="mt-2" id="productDetails">
                    <div class="row">
                        <div class="col-12">
                            <div class="row">
                                <div class="col">
                                    <label for="selectEenheid">Eenheid</label>
                                </div>
                                <div class="col">
                                    <label for="productAantal">Aantal</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <select class="form-control" onchange="MakeSaveButtonAvailable()" id="selectEenheid" name="selectEeinheid"></select>
                                </div>
                                <div class="col">
                                    <input id="productAantal" name="productAantal" type="number" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" disabled id="btnSaveNewOrder" class="btn btn-success" onclick="SaveNewOrder()">Opslaan</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Sluiten</button>
            </div>
        </div>
    </div>
</div>

<!-- Nieuwe klant Modal -->
<div class="modal fade" id="NewCustomerModal" tabindex="-1" role="dialog" aria-labelledby="NewCustomerModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="NewCustomerModalLongTitle">Nieuwe klant</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="bedrijfsnaam">Bedrijfsnaam</label>
                            <input required class="form-control" type="text" id="bedrijfsnaam" name="bedrijfsnaam">
                        </div>
                        <div class="form-group">
                            <label for="contactpersoon">Contactpersoon</label>
                            <input required class="form-control" type="text" id="contactpersoon" name="contactpersoon">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input required class="form-control" type="email" id="email" name="email">
                        </div>
                        <div class="form-group">
                            <label for="telefoon">Telefoon</label>
                            <input required class="form-control" type="tel" id="telefoon" name="telefoon">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" onclick="SaveNewCustomer()">Opslaan</button>
                <button type="button" class="btn btn-danger" onclick="CancelNewCustomer()">Sluiten</button>
            </div>
        </div>
    </div>
</div>

<!-- Voorraad WatchProduct Modal -->
<div class="modal fade" id="VoorraadModal" tabindex="-1" role="dialog" aria-labelledby="VoorraadModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="VoorraadModalLongTitle">Voorraad artikel</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                        Artikelnummer: <span id="VoorraadArtikelNummerModal"></span><br>
                        Omschrijving: <span id="VoorraadArtikelOmschrijvingModal"></span>
                    </div>
                    <div class="col-sm-6">
                        <button id="btnNewEenheid" class="btn btn-success"><i class="far fa-plus-square"></i> Eenheid toevoegen</button>
                    </div>
                </div>
                <!-- TODO: Hier bestelgegevens inladen -->

                <table id="ArtikelVoorraad" class="table table-striped">
                    <thead>
                    <th>Eenheid</th>
                    <th>Aantal</th>
                    <th>Locatie</th>
                    <th>Actie</th>
                    </thead>
                    <tbody id="tbodyVoorraad"></tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Sluiten</button>
            </div>
        </div>
    </div>
</div>

<!-- Nieuw Product Modal -->
<div class="modal fade" id="NewProductModal" tabindex="-1" role="dialog" aria-labelledby="NewProductModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="NewProductModalLongTitle">Nieuw product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="bedrijfsnaam">Omschrijving</label>
                            <input required class="form-control" type="text" id="omschrijving" name="omschrijving">
                        </div>
                        <div class="form-group">
                            <label for="contactpersoon">Prijs</label>
                            <input required class="form-control" type="number" id="prijs" name="prijs">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" onclick="SaveNewProduct()">Opslaan</button>
                <button type="button" class="btn btn-danger" onclick="CancelNewProduct()">Sluiten</button>
            </div>
        </div>
    </div>
</div>

<!-- /.container-fluid -->
@endsection
