// Peta Desa JavaScript - Updated with complete layers

let map;
let layers = {};
let markers = {};
let bounds_group;

// Initialize map
document.addEventListener('DOMContentLoaded', function () {
    initializeMap();
    setupControls();
    loadLayers();
});

function initializeMap() {
    // Koordinat dari data baru
    const center = [-7.456566671974278, 109.47078180006880];

    map = L.map('map', {
        zoomControl: false,
        maxZoom: 28,
        minZoom: 1
    }).setView(center, 15);

    // Add zoom control
    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    // Add tile layers
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 1
    });

    const satellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: 'Google Satellite',
        maxZoom: 20
    });

    // Default layer
    osm.addTo(map);

    // Layer control
    const baseLayers = {
        'OpenStreetMap': osm,
        'Satelit': satellite
    };

    L.control.layers(baseLayers).addTo(map);

    // Scale control
    L.control.scale({
        position: 'bottomleft'
    }).addTo(map);

    // Locate control
    L.control.locate({
        locateOptions: { maxZoom: 19 },
        position: 'topleft'
    }).addTo(map);

    bounds_group = new L.featureGroup([]);
}

function loadLayers() {
    // Layer Desa (Batas Desa)
    layers.desa = L.layerGroup();
    const desaPolygon = L.polygon([
        [-7.463063, 109.436650],
        [-7.463063, 109.504913],
        [-7.450071, 109.504913],
        [-7.450071, 109.436650]
    ], {
        color: '#d80013',
        fillColor: 'rgba(0,0,0,0.1)',
        fillOpacity: 0.2,
        weight: 4,
        dashArray: '10, 5'
    }).bindPopup('<h4>Desa Pekuncen</h4><p>Kecamatan Jatilawang<br>Kabupaten Banyumas</p>');
    desaPolygon.addTo(layers.desa);
    layers.desa.addTo(map);

    // Layer Dusun dengan warna berbeda
    layers.dusun = L.layerGroup();
    const dusunData = [
        { name: 'Buaran', color: '#e5da3e', coords: [[-7.458, 109.445], [-7.458, 109.455], [-7.453, 109.455], [-7.453, 109.445]] },
        { name: 'Kalinasuh', color: '#131eef', coords: [[-7.458, 109.458], [-7.458, 109.468], [-7.453, 109.468], [-7.453, 109.458]] },
        { name: 'Karang Gude', color: '#2eea21', coords: [[-7.458, 109.471], [-7.458, 109.481], [-7.453, 109.481], [-7.453, 109.471]] },
        { name: 'Karang Pucung', color: '#eb212f', coords: [[-7.458, 109.484], [-7.458, 109.494], [-7.453, 109.494], [-7.453, 109.484]] },
        { name: 'Pagendotan', color: '#d676db', coords: [[-7.458, 109.497], [-7.458, 109.502], [-7.453, 109.502], [-7.453, 109.497]] }
    ];

    dusunData.forEach(dusun => {
        const polygon = L.polygon(dusun.coords, {
            color: '#800e10',
            fillColor: dusun.color,
            fillOpacity: 0.685,
            weight: 1
        }).bindPopup(`<h4>Dusun ${dusun.name}</h4>`);
        polygon.addTo(layers.dusun);
    });
    layers.dusun.addTo(map);

    // Layer Sawah
    layers.sawah = L.layerGroup();
    const sawahPolygon = L.polygon([
        [-7.460, 109.470],
        [-7.460, 109.480],
        [-7.456, 109.480],
        [-7.456, 109.470]
    ], {
        color: '#38803e',
        fillColor: '#4daf4a',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>Area Persawahan</h4>');
    sawahPolygon.addTo(layers.sawah);
    layers.sawah.addTo(map);

    // Layer Rumah/Bangunan
    layers.rumah = L.layerGroup();
    const buildings = [
        { coords: [[-7.456, 109.470], [-7.456, 109.471], [-7.455, 109.471], [-7.455, 109.470]] },
        { coords: [[-7.457, 109.472], [-7.457, 109.473], [-7.456, 109.473], [-7.456, 109.472]] }
    ];
    buildings.forEach(building => {
        const polygon = L.polygon(building.coords, {
            color: '#232323',
            fillColor: '#987db7',
            fillOpacity: 1,
            weight: 1
        });
        polygon.addTo(layers.rumah);
    });
    layers.rumah.addTo(map);

    // Layer Jalan
    layers.jalan = L.layerGroup();
    const jalanTypes = [
        { name: 'Jalan Kecamatan', coords: [[-7.463, 109.470], [-7.450, 109.470]], color: '#000000', weight: 8 },
        { name: 'Jalan Desa', coords: [[-7.458, 109.445], [-7.458, 109.502]], color: '#000000', weight: 4 },
        { name: 'Jalan Gang', coords: [[-7.456, 109.468], [-7.456, 109.475]], color: '#99a6f3', weight: 4 },
        { name: 'Jalan Setapak', coords: [[-7.457, 109.478], [-7.455, 109.478]], color: '#b86108', weight: 4 }
    ];

    jalanTypes.forEach(jalan => {
        const line = L.polyline(jalan.coords, {
            color: jalan.color,
            weight: jalan.weight,
            lineCap: 'round',
            lineJoin: 'round'
        }).bindPopup(`<h4>${jalan.name}</h4>`);
        line.addTo(layers.jalan);
    });
    layers.jalan.addTo(map);

    // Layer Irigasi
    layers.irigasi = L.layerGroup();
    const irigasi = L.polyline([
        [-7.461, 109.460],
        [-7.459, 109.462],
        [-7.457, 109.464]
    ], {
        color: '#487bb6',
        weight: 3
    }).bindPopup('<h4>Saluran Irigasi</h4>');
    irigasi.addTo(layers.irigasi);
    layers.irigasi.addTo(map);

    // Point Markers - Sekolah
    layers.sekolah = L.layerGroup();
    markers.sekolah = L.circleMarker([-7.456500, 109.471000], {
        radius: 6,
        color: '#232323',
        fillColor: '#ff9e17',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>SD Negeri Pekuncen</h4><p>Fasilitas Pendidikan</p>');
    markers.sekolah.addTo(layers.sekolah);
    layers.sekolah.addTo(map);

    // Lapangan
    layers.lapangan = L.layerGroup();
    markers.lapangan = L.circleMarker([-7.457000, 109.472000], {
        radius: 6,
        color: '#232323',
        fillColor: '#ff9e17',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>Lapangan Desa</h4>');
    markers.lapangan.addTo(layers.lapangan);
    layers.lapangan.addTo(map);

    // SPBU
    layers.spbu = L.layerGroup();
    markers.spbu = L.circleMarker([-7.455500, 109.469500], {
        radius: 6,
        color: '#232323',
        fillColor: '#f3a6b2',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>SPBU</h4><p>Stasiun Pengisian BBM</p>');
    markers.spbu.addTo(layers.spbu);
    layers.spbu.addTo(map);

    // Fasilitas Keagamaan
    layers.fasilitaskeagamaan = L.layerGroup();
    markers.fasilitaskeagamaan = L.circleMarker([-7.456800, 109.470500], {
        radius: 6,
        color: '#232323',
        fillColor: '#f3a6b2',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>Masjid</h4><p>Tempat Ibadah</p>');
    markers.fasilitaskeagamaan.addTo(layers.fasilitaskeagamaan);
    layers.fasilitaskeagamaan.addTo(map);

    // Tempat Makan
    layers.tempatmakan = L.layerGroup();
    markers.tempatmakan = L.circleMarker([-7.456200, 109.471500], {
        radius: 6,
        color: '#232323',
        fillColor: '#a47158',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>Warung Makan</h4>');
    markers.tempatmakan.addTo(layers.tempatmakan);
    layers.tempatmakan.addTo(map);

    // Pemakaman
    layers.pemakaman = L.layerGroup();
    markers.pemakaman = L.circleMarker([-7.458500, 109.469000], {
        radius: 6,
        color: '#232323',
        fillColor: '#e5b636',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>Pemakaman Umum</h4>');
    markers.pemakaman.addTo(layers.pemakaman);
    layers.pemakaman.addTo(map);

    // Kantor
    layers.kantor = L.layerGroup();
    markers.kantor = L.circleMarker([-7.456600, 109.470800], {
        radius: 6,
        color: '#232323',
        fillColor: '#987db7',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>Kantor Desa</h4>');
    markers.kantor.addTo(layers.kantor);
    layers.kantor.addTo(map);

    // Toko
    layers.toko = L.layerGroup();
    markers.toko = L.circleMarker([-7.456300, 109.471200], {
        radius: 6,
        color: '#232323',
        fillColor: '#91522d',
        fillOpacity: 1,
        weight: 1
    }).bindPopup('<h4>Toko/Warung</h4>');
    markers.toko.addTo(layers.toko);
    layers.toko.addTo(map);

    // Rumah Saya (Special Marker)
    layers.rumahsaya = L.layerGroup();
    markers.rumahsaya = L.circleMarker([-7.456566, 109.470788], {
        radius: 8,
        color: '#232323',
        fillColor: '#ff3232',
        fillOpacity: 1,
        weight: 2
    }).bindPopup('<h4 style="color: #d72121;">Rumah Saya</h4><p><b>Rhiu</b><br>Desa Pekuncen<br>RT/RW: 01/02</p>');
    markers.rumahsaya.addTo(layers.rumahsaya);
    layers.rumahsaya.addTo(map);
}

function setupControls() {
    // Sidebar toggle
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Layer toggles
    const layerToggles = document.querySelectorAll('.layer-toggle');
    layerToggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const layerName = this.dataset.layer;
            if (this.checked) {
                if (layers[layerName]) {
                    layers[layerName].addTo(map);
                }
            } else {
                if (layers[layerName]) {
                    map.removeLayer(layers[layerName]);
                }
            }
        });
    });

    // Clear all layers
    const clearBtn = document.getElementById('clearLayers');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            layerToggles.forEach(toggle => {
                toggle.checked = false;
                const layerName = toggle.dataset.layer;
                if (layers[layerName]) {
                    map.removeLayer(layers[layerName]);
                }
            });
        });
    }

    // Home button
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function () {
            map.setView([-7.456566671974278, 109.47078180006880], 15);
        });
    }

    // Locate button
    const locateBtn = document.getElementById('locateBtn');
    if (locateBtn) {
        locateBtn.addEventListener('click', function () {
            map.locate({ setView: true, maxZoom: 16 });
        });
    }

    map.on('locationfound', function (e) {
        L.marker(e.latlng, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>',
                iconSize: [20, 20]
            })
        }).addTo(map).bindPopup('Lokasi Anda').openPopup();
    });

    map.on('locationerror', function () {
        alert('Tidak dapat menemukan lokasi Anda');
    });

    // Search functionality
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const query = this.value.toLowerCase();

                // Search by coordinates
                if (query.includes(',')) {
                    const coords = query.split(',').map(c => parseFloat(c.trim()));
                    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                        map.setView(coords, 18);
                        L.marker(coords).addTo(map)
                            .bindPopup('Hasil Pencarian').openPopup();
                        return;
                    }
                }

                // Search by name
                const searchTerms = {
                    'rumah saya': [-7.456566, 109.470788],
                    'kantor desa': [-7.456600, 109.470800],
                    'sekolah': [-7.456500, 109.471000],
                    'masjid': [-7.456800, 109.470500],
                    'lapangan': [-7.457000, 109.472000]
                };

                for (let [term, coords] of Object.entries(searchTerms)) {
                    if (query.includes(term)) {
                        map.setView(coords, 18);
                        L.marker(coords).addTo(map)
                            .bindPopup(`Ditemukan: ${term}`).openPopup();
                        return;
                    }
                }

                alert('Lokasi tidak ditemukan');
            }
        });
    }
}

console.log('🗺️ Peta Desa Pekuncen loaded successfully');