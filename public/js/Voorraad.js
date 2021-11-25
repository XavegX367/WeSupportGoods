let newVoorraadEenheid;
let newVoorraadAantal;
let newVoorraadLocatie;
let voorraadEenheid;
let voorraadAantal;
let voorraadLocatie;
let omschrijvingCurrent;
let artikelnummerCurrent;

let artikelOmschrijving;
let artikelPrijs;

const SendDataToVoorraadModal = async (artikelnummer, omschrijving) => {
    document.getElementById('VoorraadArtikelNummerModal').innerText = artikelnummer;
    document.getElementById('VoorraadArtikelOmschrijvingModal').innerText = omschrijving;
    omschrijvingCurrent = omschrijving;
    artikelnummerCurrent= artikelnummer;
    const body = document.getElementById('tbodyVoorraad');
    body.innerHTML= "";
    const response = await fetch('/voorraad/'+artikelnummer);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        const tr = document.createElement('tr');
        tr.setAttribute('id', 'trVoorraad'+data[i].voorraadId);
        const tdEenheid = document.createElement('td');
        tdEenheid.setAttribute('id', 'tdVoorraadEenheid'+data[i].voorraadId);
        tdEenheid.innerHTML = data[i].Eenheid;

        const tdAantal = document.createElement('td');
        tdAantal.setAttribute('id', 'tdVoorraadAantal'+data[i].voorraadId);
        tdAantal.innerHTML = data[i].Aantal;

        const tdLocatie = document.createElement('td');
        tdLocatie.setAttribute('id', 'tdVoorraadLocatie'+data[i].voorraadId);
        tdLocatie.innerHTML = data[i].Locatie;

        const tdActie = document.createElement('td');
        tdActie.setAttribute('id', 'orderItem'+data[i].voorraadId);
        tdActie.innerHTML = `<button class='btn btn-info' onclick='EditVoorraad(${data[i].voorraadId})'><i class="fas fa-edit"></i></button>`;

        tr.appendChild(tdEenheid);
        tr.appendChild(tdAantal);
        tr.appendChild(tdLocatie);
        tr.appendChild(tdActie);

        body.appendChild(tr);
    }
    document.getElementById('btnNewEenheid').setAttribute('onClick', `AddNewEenheidToProduct(${artikelnummer})`)

}

const AddNewEenheidToProduct = (id) => {
    const body = document.getElementById('tbodyVoorraad');
    body.innerHTML += `<tr id="RowNewEenheid"><td><input type="text" name="inputVoorraadEenheid" id="inputVoorraadEenheid" class="form-control" placeholder="Eenheid"></td><td><input type="number" name="inputVoorraadAantal" id="inputVoorraadAantal" class="form-control" placeholder="Aantal"></td><td><input type="text" name="inputVoorraadLocatie" id="inputVoorraadLocatie" class="form-control" placeholder="Locatie"></td><td><button class="btn btn-success" onclick="SaveNewEenheid(${id})"><i class="fas fa-save"></i></button> <button class='btn btn-danger' onclick='CancelNewEenheid()'><i class="fas fa-trash"></i></button></td></tr>`;
}

const SaveNewEenheid = (id) => {
    newVoorraadEenheid = document.getElementById('inputVoorraadEenheid').value;
    newVoorraadAantal = document.getElementById('inputVoorraadAantal').value;
    newVoorraadLocatie = document.getElementById('inputVoorraadLocatie').value;

    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('Eenheid', newVoorraadEenheid);
    formdata.append('Aantal', newVoorraadAantal);
    formdata.append('Locatie', newVoorraadLocatie);

    fetch('/saveneweenheid',{
        method: 'post',
        body: formdata,
    })

    SendDataToVoorraadModal(id, omschrijvingCurrent);
}

const CancelNewEenheid = () => {
    document.getElementById('RowNewEenheid').remove();
}

const EditVoorraad = (id) => {
    const row = document.getElementById('trVoorraad'+id);
    voorraadEenheid = document.getElementById('tdVoorraadEenheid'+id).innerHTML;
    voorraadAantal = document.getElementById('tdVoorraadAantal'+id).innerHTML;
    voorraadLocatie = document.getElementById('tdVoorraadLocatie'+id).innerHTML;
    row.innerHTML = `<td>${voorraadEenheid}</td>`;
    row.innerHTML += `<td><input type="number" name="inputVoorraadAantal" id="inputVoorraadAantal" value="${voorraadAantal}" class="form-control"></td>`;
    row.innerHTML += `<td><input type="text" name="inputVoorraadLocatie" id="inputVoorraadLocatie" value="${voorraadLocatie}" class="form-control"></td>`;
    row.innerHTML += `<td><button class="btn btn-success" onclick="SaveVoorraadEdit(${id})"><i class="fas fa-save"></i></button> <button class='btn btn-danger' onclick='CancelEditVoorraad(${id})'><i class="fas fa-times"></i></button></td>`;
}

const SaveVoorraadEdit = (id) => {
    voorraadAantal = document.getElementById('inputVoorraadAantal').value;
    voorraadLocatie = document.getElementById('inputVoorraadLocatie').value;

    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('Aantal', voorraadAantal);
    formdata.append('Locatie', voorraadLocatie);

    fetch('/savevoorraadedit', {
        method: 'post',
        body: formdata,
    })
    SendDataToVoorraadModal(artikelnummerCurrent, omschrijvingCurrent);
}

const CancelEditVoorraad = (id) => {
    const row = document.getElementById('trVoorraad'+id);
    row.innerHTML = `<td>${voorraadEenheid}</td><td>${voorraadAantal}</td><td>${voorraadLocatie}</td><td><button class='btn btn-info' onclick='EditVoorraad(${id})'><i class="fas fa-edit"></i></button></td>`
}

const SaveNewProduct = () => {
    let newProductDescription = document.getElementById('omschrijving').value;
    let newProductPrice = document.getElementById('prijs').value;

    const formdata = new FormData();
    formdata.append('Omschrijving', newProductDescription);
    formdata.append('Prijs', newProductPrice);

    fetch('savenewproduct',{
        method: 'post',
        body: formdata,
    })
    RefreshVoorraadTable();
    CancelNewProduct();
}

const CancelNewProduct = () => {
    $('#NewProductModal').modal('hide');
    document.getElementById('omschrijving').value = "";
    document.getElementById('prijs').value = "";
}

const RefreshVoorraadTable = async () => {
    const tbody = document.getElementById('voorraadTableBody');
    tbody.innerHTML = "";
    const response = await fetch('/refreshvoorraadtable');
    console.log('alle artikelen succesvol opgehaald');
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        tbody.innerHTML += `<tr id="tr${data[i].Artikelnummer}"><td>${data[i].Artikelnummer}</td><td id="tdArtikelOmschrijving${data[i].Artikelnummer}">${data[i].Omschrijving}</td><td id="tdArtikelPrijs${data[i].Artikelnummer}">€${data[i].Prijs}</td><td id="tdArtikelButtons${data[i].Artikelnummer}"><button class="btn btn-success" onclick="EditArtikel(${data[i].Artikelnummer})" id="btnEditProductLine"><i class="fas fa-edit"></i></button> <button type="button" data-toggle="modal" data-target="#VoorraadModal" class="btn btn-primary" id="btnWatchProduct" onclick="SendDataToVoorraadModal(${data[i].Artikelnummer}, '${data[i].Omschrijving}')"><i class="fas fa-eye"></i></button></td>`
    }
}

const EditArtikel = (id) =>{
    let tdOmschrijving = document.getElementById('tdArtikelOmschrijving'+id);
    let tdPrijs = document.getElementById('tdArtikelPrijs'+id);
    let tdButtons = document.getElementById('tdArtikelButtons'+id);

    artikelOmschrijving = tdOmschrijving.innerHTML;
    artikelPrijs = tdPrijs.innerHTML;
    artikelPrijs = artikelPrijs.replace(/[^0-9$.,]/g, '')
    tdOmschrijving.innerHTML = `<input value="${artikelOmschrijving}" type="text" class="form-control" id="inputArtikelOmschrijving${id}" name="inputArtikelOmschrijving${id}">`;
    tdPrijs.innerHTML = `<input value="${artikelPrijs}" type="number" class="form-control" id="inputArtikelPrijs${id}" name="inputArtikelPrijs${id}">`;
    tdButtons.innerHTML = `<button class="btn btn-success" onclick="SaveArtikelEdit(${id})"><i class="fas fa-save"></i></button> <button class='btn btn-danger' onclick='CancelArtikelEdit(${id})'><i class="fas fa-times"></i></button>`
}

const SaveArtikelEdit = (id) => {
    artikelOmschrijving = document.getElementById(`inputArtikelOmschrijving${id}`).value;
    artikelPrijs = document.getElementById(`inputArtikelPrijs${id}`).value;
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('Omschrijving', artikelOmschrijving);
    formdata.append('Prijs', artikelPrijs);

    fetch('saveartikeledit', {
        method: 'post',
        body: formdata,
    })

    CancelArtikelEdit(id);
}

const CancelArtikelEdit = (id) => {
    let tdOmschrijving = document.getElementById('tdArtikelOmschrijving'+id);
    let tdPrijs = document.getElementById('tdArtikelPrijs'+id);
    let tdButtons = document.getElementById('tdArtikelButtons'+id);

    tdOmschrijving.innerHTML = artikelOmschrijving;
    tdPrijs.innerHTML = `€${artikelPrijs}`;
    tdButtons.innerHTML = `<button class="btn btn-success" onclick="EditArtikel(${id})" id="btnEditProductLine"><i class="fas fa-edit"></i></button> <button type="button" data-toggle="modal" data-target="#VoorraadModal" class="btn btn-primary" id="btnWatchProduct" onclick="SendDataToVoorraadModal(${id}, '${artikelOmschrijving}')"><i class="fas fa-eye"></i></button>`
}
