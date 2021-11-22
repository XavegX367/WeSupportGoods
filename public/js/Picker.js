let Omschrijving;
let Aantal;
let Eenheid;
let Locatie;

const SendDataToModal = async (id, bedrijfsnaam) => {
    document.getElementById('btnFinish').setAttribute('disabled', 'true');
    const body = document.getElementById('tbodyPicker');
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
            tdActie.innerHTML = `<button class='btn btn-success' onclick='Pick(${data[i].BestelRegelId}, ${data[i].Aantal}, "${data[i].Eenheid}", ${id})'>Picken</button>`;
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
    Swal.fire('Order afgerond!', '', 'success');
    $('#PickerModal').modal('hide');

    document.getElementById(`btnPicker${id}`).innerHTML = '<span style="color: lightgreen"><i class="fas fa-check"></i></span>';
}


