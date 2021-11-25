let selectedCustomer;
let selectedProduct;
let selectedEenheid;
let newProductLocatie;
let bestelnummer;
let bedrijf;
let contact;
let tel;
let mail;

const SendDataToVerkoperModal = async (id, bedrijfsnaam, contactpersoon, telefoon, email) => {
    const body = document.getElementById('tbodyVerkoper');
    body.innerHTML = "";
    bestelnummer = id;
    bedrijf = bedrijfsnaam
    contact = contactpersoon;
    tel = telefoon;
    mail = email;
    document.getElementById('VerkoperBestelNummer').innerHTML = id;
    document.getElementById('VerkoperBedrijfsnaam').innerHTML = bedrijfsnaam;
    document.getElementById('VerkoperContactpersoon').innerHTML = contactpersoon;
    document.getElementById('VerkoperTelefoon').innerHTML = telefoon;
    document.getElementById('VerkoperEmail').innerHTML = `<A HREF="mailto:${email}">${email}</A>`;
    const response = await fetch('/verkoper/'+id);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        const tr = document.createElement('tr');
        tr.setAttribute('id', 'trVerkoper'+data[i].BestelRegelId);
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
        tdActie.innerHTML = `<button class='btn btn-info' onclick='EditProduct(${data[i].BestelRegelId}, ${data[i].Artikelnummer})'><i class="fas fa-edit"></i></button> `;
        tdActie.innerHTML += `<button class='btn btn-danger' onclick='RemoveProduct(${data[i].BestelRegelId})'><i class="fas fa-trash"></i></button>`;

        tr.appendChild(tdOmschrijving);
        tr.appendChild(tdAantal);
        tr.appendChild(tdEenheid);
        tr.appendChild(tdLocatie);
        tr.appendChild(tdActie);

        body.appendChild(tr);
    }
}

const RemoveProduct = (id) => {
    const formdata = new FormData();
    formdata.append('id', id)
    fetch('/verkoperremoveproduct', {
        method: 'post',
        body: formdata,
    })
    SendDataToVerkoperModal(bestelnummer, bedrijf, contact, tel, mail);
}

const EditProduct = async (id, artikelnummer) => {
    Omschrijving = document.getElementById('tdVOmschrijving'+id).innerHTML;
    Aantal = document.getElementById('tdVAantal'+id).innerHTML;
    Eenheid = document.getElementById('tdVEenheid'+id).innerHTML;
    Locatie = document.getElementById('tdVLocatie'+id).innerHTML;
    document.getElementById('trVerkoper' + id).innerHTML = `<td>${Omschrijving}</td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td><input type='number' id='inputAantal${id}' class="form-control" value="${Aantal}"></td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td><select class="form-control" id="eenheidSelect"></select></td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td>${Locatie}</td>`;
    document.getElementById('trVerkoper' + id).innerHTML += `<td><button onclick="SaveProduct(${id})" class="btn btn-success"><i class="far fa-save"></i></button><button onclick="AbortEdit(${id})" class="btn btn-danger"><i class="fas fa-times"></i></button></td>`;
    const eenheidSelect = document.getElementById('eenheidSelect');
    const response = await fetch(`/getproductdetails/${artikelnummer}`);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        eenheidSelect.innerHTML += `<option value="${data[i].Eenheid}">${data[i].Eenheid}</option>`;
    }
    document.getElementById('newProductLineLocatie').innerHTML = "";
}

const SaveProduct = (id) => {
    Aantal = document.getElementById('inputAantal'+id).value;
    const select = document.getElementById("eenheidSelect");
    Eenheid = select.options[select.selectedIndex].value;

    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('Aantal', Aantal);
    formdata.append('Eenheid', Eenheid);

    fetch('/verkopersaveproduct', {
        method: 'post',
        body: formdata,
    })
    AbortEdit(id);
}

const AbortEdit = (id) => {
    document.getElementById('trVerkoper'+id).innerHTML = `<td id="tdVOmschrijving${id}">${Omschrijving}</td>`;
    document.getElementById('trVerkoper'+id).innerHTML += `<td id="tdVAantal${id}">${Aantal}</td>`;
    document.getElementById('trVerkoper'+id).innerHTML += `<td id="tdVEenheid${id}">${Eenheid}</td>`;
    document.getElementById('trVerkoper'+id).innerHTML += `<td id="tdVLocatie${id}">${Locatie}</td>`;
    document.getElementById('trVerkoper'+id).innerHTML += `<td id="orderItem${id}"><button class='btn btn-info' onclick='EditProduct(${id})'><i class="fas fa-edit"></i></button> <button class='btn btn-danger' onclick='RemoveProduct(${id})'><i class="fas fa-times"></i></button></td>`;
}

const SaveNewCustomer = () => {
    const bedrijfsnaam = document.getElementById('bedrijfsnaam').value;
    const contactpersoon = document.getElementById('contactpersoon').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('telefoon').value;
    if (bedrijfsnaam === "")
    {
        alert("Alle gegevens dienen te worden ingevuld!");
        return;
    }
    else if (contactpersoon === "")
    {
        alert("Alle gegevens dienen te worden ingevuld!");
        return;
    }
    else if (email === "")
    {
        alert("Alle gegevens dienen te worden ingevuld!");
        return;
    }
    else if (tel === "")
    {
        alert("Alle gegevens dienen te worden ingevuld!");
        return;
    }
    const formdata = new FormData();
    formdata.append('Bedrijfsnaam', bedrijfsnaam);
    formdata.append('Contactpersoon', contactpersoon);
    formdata.append('Email', email);
    formdata.append('Telefoonnummer', tel);

    fetch('/savenewcustomer', {
        method: 'post',
        body: formdata,
    })
    Swal.fire('Gelukt!', 'Klant is succesvol toegevoegd', 'success');
    CancelNewCustomer();
}

const CancelNewCustomer = ()  =>{
    $('#NewCustomerModal').modal('hide');
    document.getElementById('bedrijfsnaam').value = "";
    document.getElementById('contactpersoon').value = "";
    document.getElementById('email').value = "";
    document.getElementById('telefoon').value = "";
}

const SendDataToNewOrderModal = async () => {
    HideProductSelect();
    HideProductDetails();
    document.getElementById('productAantal').value = "";
    const select = document.getElementById('selectCustomer');
    select.innerHTML = `<option value="0">Maak een keuze</option>`;
    const response = await fetch('/getcustomers');
    console.log('alle klanten succesvol opgehaald');
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        select.innerHTML += `<option value="${data[i].Klantnummer}">${data[i].Bedrijfsnaam}</option>`;
    }
}

const HideProductDetails = () => {
    document.getElementById('productDetails').setAttribute('hidden', 'true');
    document.getElementById('btnSaveNewOrder').setAttribute('disabled', 'true');
}

const HideProductSelect = () => {
    document.getElementById('rowSelectProduct').setAttribute('hidden', 'true');
}

const loadOrderData = async () => {
    const select = document.getElementById("selectCustomer");
    selectedCustomer = select.options[select.selectedIndex].value;
    if (selectedCustomer === "0"){
        HideProductSelect();
        HideProductDetails();
        return;
    }
    const selectProduct = document.getElementById('selectProduct');
    selectProduct.innerHTML = `<option value="0">Maak een keuze</option>`;
    const selectEenheid = document.getElementById('selectEenheid');
    selectEenheid.innerHTML = `<option value="0">Maak een keuze</option>`;
    document.getElementById('rowSelectProduct').removeAttribute('hidden');

    const response = await fetch('/getproducts');
    console.log('alle producten succesvol opgehaald');
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        selectProduct.innerHTML += `<option value="${data[i].Artikelnummer}">${data[i].Omschrijving}</option>`;
    }
}

const LoadProductDetails = async () => {
    document.getElementById('productAantal').value = "";
    const select = document.getElementById('selectProduct');
    selectedProduct = select.options[select.selectedIndex].value;
    const selectEenheid = document.getElementById('selectEenheid');
    selectEenheid.innerHTML = `<option value="0">Maak een keuze</option>`;
    if (selectedProduct === 0)
    {
        HideProductDetails();
        document.getElementById('btnSaveNewOrder').setAttribute('disabled', 'true');
        selectedEenheid = "0";
        return;
    }
    document.getElementById('productDetails').removeAttribute('hidden');

    const response = await fetch('/getproductdetails/'+selectedProduct);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        selectEenheid.innerHTML += `<option value="${data[i].Eenheid}">${data[i].Eenheid}</option>`;
    }
}

const MakeSaveButtonAvailable = () => {
    const select = document.getElementById('selectEenheid');
    selectedEenheid = select.options[select.selectedIndex].value;
    if (selectedEenheid === "0")
    {
        document.getElementById('btnSaveNewOrder').setAttribute('disabled', 'true');
        return;
    }
    document.getElementById('btnSaveNewOrder').removeAttribute('disabled');
}

const SaveNewOrder = () => {
    let productAmount = document.getElementById('productAantal').value;

    const formdata = new FormData();
    formdata.append('customer', selectedCustomer);
    formdata.append('product', selectedProduct);
    formdata.append('eenheid', selectedEenheid);
    formdata.append('aantal', productAmount);

    fetch('/saveneworder', {
        method: 'post',
        body: formdata,
    })
    Swal.fire('Gelukt!', 'Bestelling is succesvol toegevoegd', 'success');
    RefreshVerkoperTable();
    $('#NewOrderModal').modal('hide');
    document.getElementById('productAantal').value = "";
}

const RefreshVerkoperTable = async () => {
    const tbody = document.getElementById('verkoperTableBody');
    tbody.innerHTML = "";
    const response = await fetch('/refreshsellertable');
    console.log('alle bestellingen succesvol opgehaald');
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        tbody.innerHTML += `<tr id="tr${data[i].Bestellingnummer}"><td>${data[i].Bestellingnummer}</td><td>${data[i].Bedrijfsnaam}</td><td>${data[i].Contactpersoon}</td><td id="btnPicker${data[i].Bestellingnummer}"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#VerkoperModal" onclick="SendDataToVerkoperModal(${data[i].Bestellingnummer}, '${data[i].Bedrijfsnaam}', '${data[i].Contactpersoon}', '${data[i].Telefoonnummer}', '${data[i].Email}')">Bekijken</button></td></tr>`;
    }
}

const AddNewProductToOrder = async () => {
    const body = document.getElementById('tbodyVerkoper');

    const tr = document.createElement('tr');
    tr.setAttribute('id', 'newProductLine');
    const tdOmschrijving = document.createElement('td');
    tdOmschrijving.innerHTML = `<select class="form-control" id="newProductLineOmschrijving" onchange="LoadEenheid()"><option value="0">Maak een keuze</option></select>`;

    const tdAantal = document.createElement('td');
    tdAantal.innerHTML = `<input class="form-control" id="newProductLineAantal" type="number">`;

    const tdEenheid = document.createElement('td');
    tdEenheid.innerHTML = `<select class="form-control" id="newProductLineEenheid" onchange="LoadProductLocation()"><option value="0">Kies eerst een artikel</option></select>`;

    const tdLocatie = document.createElement('td');
    tdLocatie.setAttribute('id', 'newProductLineLocatie');

    const tdActie = document.createElement('td');
    tdActie.setAttribute('id', 'newProductLineActie');
    tdActie.innerHTML = `<button class='btn btn-success' onclick='SaveNewProductLine()'><i class="fas fa-save"></i></button> `;
    tdActie.innerHTML += `<button class='btn btn-danger' onclick='CancelNewProductLine()'><i class="fas fa-trash"></i></button>`;

    tr.appendChild(tdOmschrijving);
    tr.appendChild(tdAantal);
    tr.appendChild(tdEenheid);
    tr.appendChild(tdLocatie);
    tr.appendChild(tdActie);

    body.appendChild(tr);

    const response = await fetch('/getproducts');
    console.log('alle producten succesvol opgehaald');
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        newProductLineOmschrijving.innerHTML += `<option value="${data[i].Artikelnummer}">${data[i].Omschrijving}</option>`;
    }
}

const LoadEenheid = async () => {
    const select = document.getElementById('newProductLineOmschrijving');
    selectedProduct = select.options[select.selectedIndex].value;
    const selectEenheid = document.getElementById('newProductLineEenheid');
    selectEenheid.innerHTML = `<option value="0">Maak een keuze</option>`;
    if (selectedProduct === 0)
    {
        selectedEenheid = "0";
        return;
    }

    const response = await fetch('/getproductdetails/'+selectedProduct);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        selectEenheid.innerHTML += `<option value="${data[i].Eenheid}">${data[i].Eenheid}</option>`;
    }
    document.getElementById('newProductLineLocatie').innerHTML = "";
}

const LoadProductLocation = async () => {
    const select = document.getElementById('newProductLineEenheid');
    selectedEenheid = select.options[select.selectedIndex].value;
    const response = await fetch(`/loadproductlocation/${selectedProduct}/${selectedEenheid}`);
    let data = await response.json();
    for (let i =0; i < data.length; i++)
    {
        document.getElementById('newProductLineLocatie').innerHTML = data[i].Locatie;
    }
}

const SaveNewProductLine = () => {
    newProductLocatie = document.getElementById('newProductLineLocatie').innerHTML;
    let newProductLineAantal = document.getElementById('newProductLineAantal').value;
    const formdata = new FormData();
    formdata.append('Bestellingnummer', bestelnummer);
    formdata.append('Artikelnummer', selectedProduct);
    formdata.append('Eenheid', selectedEenheid);
    formdata.append('Aantal', newProductLineAantal);

    fetch('/savenewproductline', {
        method: 'post',
        body: formdata,
    })
    CancelNewProductLine();
}

const CancelNewProductLine = () => {
    SendDataToVerkoperModal(bestelnummer, bedrijf, contact, tel, mail);
}
