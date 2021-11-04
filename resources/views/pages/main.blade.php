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
                @foreach($results as $result)
                    <table id="PickerTable">
                        <thead>
                            <th>Bestelnummer</th>
                            <th>Afgerond</th>
                            <th>Picken</th>
                        </thead>
                        <tbody>
                            <td>{{$result->Bestellingnummer}}</td>
                            <td>
                                @if($result->afgerond == 0)
                                    Nee
                                @else
                                    Ja
                                @endif
                            </td>
                            <td>
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#PickerModal" onclick="SendDataToModal({{$result->Bestellingnummer}})">Order Picken</button>
                            </td>
                        </tbody>
                    </table>
                @endforeach
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Verkoper')
                Bestellingen
            @elseif (\Illuminate\Support\Facades\Auth::user()->Rol == 'Voorraadmanager')
                Voorraad
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
                <!-- TODO: Hier bestelgegevens inladen -->

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Sluiten</button>
                <button type="button" class="btn btn-success">Afronden</button>
            </div>
        </div>
    </div>
</div>

<script src="js/Dashboard.js"></script>
<!-- /.container-fluid -->
@endsection
