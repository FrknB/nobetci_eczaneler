const il = document.getElementById("il");
const ilce = document.getElementById("ilce");
const lists = document.getElementById("lists");

const cityDistricts = "https://turkiyeapi.dev/api/v1/provinces";

var apiData = null;

fetch(cityDistricts)
    .then(response => response.json())
    .then(data => {
        const arrayList = data.data.length;

        apiData = data;

        for (i = 0; i < arrayList; i++) {
            var option = document.createElement("option");
            option.text = data.data[i].name;
            il.add(option);
        }
    });

function selectedItem() {
    var sItem = il.options[il.selectedIndex].text;
    var ilceData = apiData.data.find(x => x.name == sItem);
    var ilceDataLength = ilceData.districts.length;
    ilce.innerHTML = ``;
    for (i = 0; i < ilceDataLength; i++) {
        var op = document.createElement("option");
        op.text = ilceData.districts[i].name;
        ilce.add(op);
    }
}

function selectedDistrict() {
    var sItem = il.options[il.selectedIndex].text;
    var districtItem = ilce.options[ilce.selectedIndex].text;
    var url = `https://api.collectapi.com/health/dutyPharmacy?ilce=${districtItem}&il=${sItem}`;
    fetch(url, {
        method: "GET",
        headers: {
            'Authorization': 'YOUR_API_KEY',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(apiData => {          
            const data = apiData.result.length;
            lists.innerHTML = "";
            apiData.result.forEach((item, index) => {
                const listItem = document.createElement("div");
                listItem.className = "pharmacy-item";
                listItem.innerHTML = `
                    <div class="name-box">
                        <h3 class="name">${item.name}</h3>
                    </div>
                    <div class="tel">
                        <a href="tel:${item.phone}">${item.phone}</a>
                    </div>
                    <div class="adress-box">
                        <span class="adress">${item.address}</span>
                    </div>
                    <div id="map${index}" class="map">
                        <a href=""> </a>
                    </div>
                `;
                lists.appendChild(listItem);
                createMapForLocation(item.loc, 'map' + index);
            });
       } ); 
}

/* use Google Maps  */
function createMapForLocation(loc, containerId) {
    const [lat, lng] = loc.split(',').map(Number);
    const mapElement = document.getElementById(containerId);
    mapElement.style.width = '100%';
    mapElement.style.height = '250px';

    const map = new google.maps.Map(mapElement, {
        zoom: 15,
        center: { lat, lng }
    });
    
    new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: 'Eczane Konumu'
    });
}