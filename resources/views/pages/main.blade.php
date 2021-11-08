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
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Verkoper')
                Bestellingen
                <table id="VerkoperTable">
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
                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#VerkoperModal" onclick="SendDataToVerkoperModal({{$result->Bestellingnummer}}, '{{$result->Bedrijfsnaam}}', '{{$result->Contactpersoon}}', '{{$result->Telefoonnummer}}', '{{$result->Email}}')">Bekijken</button>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Voorraadmanager')
                Voorraad
                <table id="VoorraadTable">
                    <thead>
                    <th>Artikelnummer</th>
                    <th>Eenheid</th>
                    <th>Locatie</th>
                    <th>Aantal</th>
                    <th>Acties</th>
                    </thead>
                    <tbody>
                    @foreach($results as $result)
                        //TODO: Voorraad gegevens inladen
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
<!-- /.container-fluid -->
@endsection
