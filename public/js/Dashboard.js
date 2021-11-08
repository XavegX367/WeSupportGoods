let Omschrijving;
let Aantal;
let Eenheid;
let Locatie;

const SendDataToModal = async (id, bedrijfsnaam) => {
    //TODO: Gegevens doorgeven aan Modal doormiddel van een fetch
    document.getElementById('btnFinish').setAttribute('disabled', 'true');
    const body = document.getElementById('tbodyVerkoper');
    body.innerHTML = "";
    document.getElementById('PickerBestelNummer').innerHTML = id;
    document.getElementById('PickerBedrijfsnaam').innerHTML = bedrijfsnaam;
    const response = await fetch('/picker/'+id);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        const inStock = data[i].inStock;
        const tr = document.createElement('tr');
        tr.setAttribute('id', 'tr'+id);
        const tdOmschrijving = document.createElement('td');
        tdOmschrijving.innerHTML = data[i].Omschrijving;
        const tdAantal = document.createElement('td');
        tdAantal.innerHTML = data[i].Aantal;

         const tdEenheid = document.createElement('td');
         tdEenheid.innerHTML = data[i].Eenheid;

        const tdLocatie = document.createElement('td');
        tdLocatie.innerHTML = data[i].locatie;

        const tdActie = document.createElement('td');
        tdActie.setAttribute('id', 'orderItem'+data[i].BestelRegelId);
        if (data[i].Picked === 1) {
            tdActie.innerHTML = '<span style="color: lightgreen"><i class="fas fa-check"></i></span>';
        }
        else if (inStock > data[i].Aantal)
        {
            tdActie.innerHTML = `<button class='btn btn-success' onclick='Pick(${data[i].BestelRegelId}, ${data[i].Aantal}, ${data[i].Eenheid}, ${id})'>Picken</button>`
        }
        else
        {
            tdActie.innerHTML = 'Niet op voorraad';
        }
        tr.appendChild(tdOmschrijving);
        tr.appendChild(tdAantal);
        tr.appendChild(tdEenheid);
        tr.appendChild(tdLocatie);
        tr.appendChild(tdActie);

        body.appendChild(tr);
    }
    await CheckOrder(id);
}

const Pick = async (id, aantal, eenheid, bestelId) => {
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('aantal', aantal);
    formdata.append('eenheid', eenheid);
    fetch('/updatepickproduct', {
        method: 'post',
        body: formdata,
    })

    const tdButton = document.getElementById('orderItem'+id);
    tdButton.innerHTML = '<span style="color: lightgreen"><i class="fas fa-check"></i></span>';
    await CheckOrder(bestelId);
}

const CheckOrder = async (id) => {
    const response = await fetch('/picker/'+id);
    let data = await response.json();
    let gereed = 0;
    for (let i =0; i < data.length; i++)
    {
        if(data[i].Picked === 0)
        {
            gereed = 0;
            return;
        }
        else
        {
            gereed = 1;
        }
    }
    if (gereed === 1){
        document.getElementById('btnFinish').removeAttribute('disabled');
        document.getElementById('btnFinish').setAttribute("onclick",`CompleteOrder(${id})`);
    }
}

const CompleteOrder = async (id) => {
    const formdata = new FormData();
    formdata.append('id', id);
    fetch('/pickercompleteorder', {
        method: 'post',
        body: formdata,
    })
    $('#PickerModal').modal('hide');

    document.getElementById(`btnPicker${id}`).innerHTML = '<span style="color: lightgreen"><i class="fas fa-check"></i></span>';
}

const SendDataToVerkoperModal = async (id, bedrijfsnaam, contactpersoon, telefoon, email) => {
    const body = document.getElementById('tbodyVerkoper');
    body.innerHTML = "";
    document.getElementById('VerkoperBestelNummer').innerHTML = id;
    document.getElementById('VerkoperBedrijfsnaam').innerHTML = bedrijfsnaam;
    document.getElementById('VerkoperContactpersoon').innerHTML = contactpersoon;
    document.getElementById('VerkoperTelefoon').innerHTML = telefoon;
    document.getElementById('VerkoperEmail').innerHTML = `<A HREF="mailto:${email}">${email}</A>`;
    const response = await fetch('/verkoper/'+id);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        const inStock = data[i].inStock;
        const tr = document.createElement('tr');
        tr.setAttribute('id', 'trVerkoper'+id);
        const tdOmschrijving = document.createElement('td');
        tdOmschrijving.setAttribute('id', 'tdVOmschrijving'+data[i].BestelRegelId);
        tdOmschrijving.innerHTML = data[i].Omschrijving;

        const tdAantal = document.createElement('td');
        tdAantal.setAttribute('id', 'tdVAantal'+data[i].BestelRegelId);
        tdAantal.innerHTML = data[i].Aantal;

        const tdEenheid = document.createElement('td');
        tdEenheid.setAttribute('id', 'tdVEenheid'+data[i].BestelRegelId);
        tdEenheid.innerHTML = data[i].Eenheid;

        const tdLocatie = document.createElement('td');
        tdLocatie.setAttribute('id', 'tdVLocatie'+data[i].BestelRegelId);
        tdLocatie.innerHTML = data[i].locatie;

        const tdActie = document.createElement('td');
        tdActie.setAttribute('id', 'orderItem'+data[i].BestelRegelId);
        tdActie.innerHTML = `<button class='btn btn-info' onclick='EditProduct(${data[i].BestelRegelId})'><i class="fas fa-edit"></i></button> `;
        tdActie.innerHTML += `<button class='btn btn-danger' onclick='RemoveProduct(${data[i].BestelRegelId})'><i class="fas fa-trash"></i></button>`;

        tr.appendChild(tdOmschrijving);
        tr.appendChild(tdAantal);
        tr.appendChild(tdEenheid);
        tr.appendChild(tdLocatie);
        tr.appendChild(tdActie);

        body.appendChild(tr);
    }
}

const EditProduct = (id) => {
    Omschrijving = document.getElementById('tdVOmschrijving'+id).innerHTML;
    Aantal = document.getElementById('tdVAantal'+id).innerHTML;
    Eenheid = document.getElementById('tdVEenheid'+id).innerHTML;
    Locatie = document.getElementById('tdVLocatie'+id).innerHTML;
    document.getElementById('trVerkoper' + id).innerHTML = `<td><input type='text' id='inputOmschrijving${id}' class="form-control" value="${Omschrijving}"></td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td><input type='number' id='inputAantal${id}' class="form-control" value="${Aantal}"></td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td><input type='number' id='inputEenheid${id}' class="form-control" value="${Eenheid}"></td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td><input type='text' id='inputLocatie${id}' class="form-control" value="${Locatie}"></td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td><button onclick="SaveProduct(${id})" class="btn btn-success"><i class="far fa-save"></i></button><button onclick="AbortEdit(${id})" class="btn btn-danger"><i class="fas fa-times"></i></button></td>`;
}

const SaveProduct = (id) => {

}

const AbortEdit = (id) => {
    document.getElementById('trVerkoper'+id).innerHTML = `<td>${Omschrijving}</td>`;
    document.getElementById('trVerkoper'+id).innerHTML += `<td>${Aantal}</td>`;
    document.getElementById('trVerkoper'+id).innerHTML += `<td>${Eenheid}</td>`;
    document.getElementById('trVerkoper'+id).innerHTML += `<td>${Locatie}</td>`;
}
