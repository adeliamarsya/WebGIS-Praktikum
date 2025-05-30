let lastScrollTop = 0;
const header = document.querySelector('header');
window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

var initialCenter = [-6.9175, 107.6191];
var initialZoom = 13;
var map = L.map('map').setView(initialCenter, initialZoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const adminKelurahanAR = new L.LayerGroup();
$.getJSON("assets/data-spasial/admin_kelurahan_ln.geojson", function (objectID) {
  L.geoJSON(objectID, {
    style: {
      color : "black",
      weight : 2,
      opacity : 1,
      dashArray: '3,3,20,3,20,3,20,3,20,3,20',
      lineJoin: 'round'
    }
}).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);

var symbologyPoint = {
  radius: 5,
  fillColor: "#9dfc03",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
  }

  const jembatanPT = new L.LayerGroup();
  $.getJSON("assets/data-spasial/jembatan_pt.geojson", function (OBJECTID) {
  L.geoJSON(OBJECTID, {
  pointToLayer: function (feature, latlng) {
  return L.circleMarker(latlng, symbologyPoint);}
  }).addTo(jembatanPT);
  });
  jembatanPT.addTo(map);

const landcover = new L.LayerGroup();
$.getJSON("assets/data-spasial/landcover_ar.geojson", function (REMARK) {
L.geoJson(REMARK, {
style: function(feature) {
switch (feature.properties.REMARK) {
case 'Danau/Situ': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight:

0.5, color: "#4065EB"};

case 'Empang': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight:

0.5, color: "#4065EB"};

case 'Hutan Rimba': return {fillColor:"#38A800", fillOpacity: 0.8, color:

"#38A800"};

case 'Perkebunan/Kebun': return {fillColor:"#E9FFBE", fillOpacity: 0.8,

color: "#E9FFBE"};

case 'Permukiman dan Tempat Kegiatan': return {fillColor:"#FFBEBE",

fillOpacity: 0.8, weight: 0.5, color: "#FB0101"};

case 'Sawah': return {fillColor:"#01FBBB", fillOpacity: 0.8, weight:

0.5, color: "#4065EB"};

case 'Semak Belukar': return {fillColor:"#389118", fillOpacity: 0.8,

weight: 0.5, color: "#00A52F"};

case 'Sungai': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight:

0.5, color: "#4065EB"};

case 'Tanah Kosong/Gundul': return {fillColor:"#c19b03", fillOpacity: 0.8,

weight: 0.5, color: "#000000"};

case 'Tegalan/Ladang': return {fillColor:"#EDFF85", fillOpacity: 0.8,

color: "#EDFF85"};

case 'Vegetasi Non Budidaya Lainnya': return {fillColor:"#000000",

fillOpacity: 0.8, weight: 0.5, color: "#000000"};

}
},
onEachFeature: function (feature, layer) {
layer.bindPopup('<b>Tutupan Lahan: </b>'+ feature.properties.REMARK)
}
}).addTo(landcover);
});
landcover.addTo(map);

const basemapOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors, HOT'
});

const baseMapGoogle = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});


const baseMaps = {
  "Openstreetmap" : basemapOSM,
  "OSM HOT" : osmHOT,
  "Google" : baseMapGoogle
};

const overlayMaps = {
  "Jembatan" : jembatanPT,
  "Batas Administrasi" : adminKelurahanAR,
  "Tutupan Lahan": landcover
};

L.control.layers(baseMaps,overlayMaps).addTo(map);

// Tombol "Home"
const homeControl = L.control({ position: 'topleft' });
homeControl.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = '🏠';
  div.style.backgroundColor = 'white';
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.lineHeight = '30px';
  div.style.textAlign = 'center';
  div.style.cursor = 'pointer';
  div.title = 'Kembali ke Home';
  div.onclick = function() {
    map.setView([home.lat, home.lng], home.zoom);
  };
  return div;
};
homeControl.addTo(map);

// Fitur "My Location"
L.control.locate({
  position: 'topleft',
  flyTo: true,
  strings: {
    title: "Temukan lokasiku"
  },
  locateOptions: {
    enableHighAccuracy: true
  }
}).addTo(map);

var symbologyPoint = { 
  radius: 5, 
  fillColor: "#9dfc03", 
  color: "#000", 
  weight: 1, 
  opacity: 1, 
  fillOpacity: 0.8 
} 
map.addControl(new L.Control.Fullscreen({
  position: 'topright',
  title: {
    'false': 'View Fullscreen',
    'true': 'Exit Fullscreen'
  }
}));

//Legenda
let legend = L.control({ position: "topright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "legend");

div.innerHTML =
// Judul Legenda
'<p style= "font-size: 18px; font-weight: bold; margin-bottom: 5px; margin-top:10px">Legenda</p>' + '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Infrastruktur</p>' + '<div><svg style="display:block;margin:auto;text-align:center;stroke-width:1;stroke:rgb(0,0,0);"><circle cx="15" cy="8" r="5" fill="#9dfc03" /></svg></div>Jembatan<br>'+

// Legenda Layer Batas Administrasi
'<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top 10px">Batas Administrasi</p>'+'<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,0,0);stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/></svg></div>BatasDesa/Kelurahan<br>'+

// Legenda Layer Tutupan Lahan
'<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Tutupan Lahan</p>' +
'<div style="background-color: #05b9f5"></div>Danau/Situ<br>' +
'<div style="background-color: #97DBF2"></div>Empang<br>' +
'<div style="background-color: #38A800"></div>Hutan Rimba<br>' +
'<div style="background-color: #E9FFBE"></div>Perkebunan/Kebun<br>' +
'<div style="background-color: #FFBEBE"></div>Permukiman dan Tempat Kegiatan<br>'+
'<div style="background-color: #01FBBB"></div>Sawah<br>' +
'<div style="background-color: #389118"></div>Semak Belukar<br>' +
'<div style="background-color: #97DBF2"></div>Sungai<br>' +
'<div style="background-color: #c19b03"></div>Tanah Kosong/Gundul<br>' +
'<div style="background-color: #EDFF85"></div>Tegalan/Ladang<br>' +
'<div style="background-color: #000000"></div>Vegetasi Non Budidaya Lainnya<br>';
return div;
};
legend.addTo(map);

// Function to reset map view to initial center and zoom
function goHome() {
  map.setView(initialCenter, initialZoom);
}

// Function to locate user's position and set map view
function locateMe() {
  map.locate({setView: true, maxZoom: 16});
  
  map.on('locationfound', function(e) {
    var radius = e.accuracy / 2;

    // Add marker at user's location
    L.marker(e.latlng).addTo(map)
      .bindPopup("Lokasi Anda berada dalam radius " + radius.toFixed(0) + " meter").openPopup();

    // Add circle around user's location
    L.circle(e.latlng, radius).addTo(map);
  });

  map.on('locationerror', function(e) {
    alert("Lokasi tidak ditemukan. Pastikan izin lokasi diaktifkan.");
  });
}

const Component = {
  "Jembatan": jembatanPT,
  "Batas Administrasi": adminKelurahanAR,
  "Penggunaan Lahan": landcover
};

L.control.layers(baseMaps, Component).addTo(map);