// Peta Kecamatan JavaScript

let map;
let layers = {};

// Initialize map
document.addEventListener('DOMContentLoaded', function () {
    initializeMap();
    setupControls();
    loadLayers();
});

function initializeMap() {
    // Koordinat Kecamatan Karanglewas (zoom out untuk melihat area lebih luas)
    const center = [-7.425779, 109.200212];

    map = L.map('map').setView(center, 14);

    // Add tile layers
    const satellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: 'Google Satellite',
        maxZoom: 20
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    });

    // Default layer
    satellite.addTo(map);

    // Layer control
    L.control.layers({
        'Satelit': satellite,
        'Peta': osm
    }).addTo(map);

    // Scale control
    L.control.scale().addTo(map);
}

function loadLayers() {
    // Batas Kecamatan
    layers.kecamatan = L.layerGroup();
    const kecamatanPolygon = L.polygon([
        [-7.420000, 109.195000],
        [-7.420000, 109.205000],
        [-7.430000, 109.205000],
        [-7.430000, 109.195000]
    ], {
        color: '#dc2626',
        fillColor: '#fca5a5',
        fillOpacity: 0.2,
        weight: 3
    }).bindPopup('<h4>Kecamatan Karanglewas</h4><p>Kabupaten Banyumas</p>');
    kecamatanPolygon.addTo(layers.kecamatan);
    layers.kecamatan.addTo(map);

    // Batas Desa
    layers.desa = L.layerGroup();

    // Desa Karanglewas Kidul
    const desaKidul = L.polygon([
        [-7.425000, 109.199000],
        [-7.425000, 109.201500],
        [-7.427000, 109.201500],
        [-7.427000, 109.199000]
    ], {
        color: '#2563eb',
        fillColor: '#93c5fd',
        fillOpacity: 0.3,
        weight: 2
    }).bindPopup('<h4>Desa Karanglewas Kidul</h4><p>Luas: ~2.5 km²</p><p>Jumlah RW: 6</p><p>Jumlah RT: 40</p>');
    desaKidul.addTo(layers.desa);

    // Desa Karanglewas Lor (contoh)
    const desaLor = L.polygon([
        [-7.422000, 109.199000],
        [-7.422000, 109.201500],
        [-7.424000, 109.201500],
        [-7.424000, 109.199000]
    ], {
        color: '#10b981',
        fillColor: '#86efac',
        fillOpacity: 0.3,
        weight: 2
    }).bindPopup('<h4>Desa Karanglewas Lor</h4><p>Area Kecamatan Karanglewas</p>');
    desaLor.addTo(layers.desa);

    layers.desa.addTo(map);

    // Pemukiman
    layers.pemukiman = L.layerGroup();
    const pemukiman1 = L.polygon([
        [-7.425500, 109.200000],
        [-7.425500, 109.200800],
        [-7.426200, 109.200800],
        [-7.426200, 109.200000]
    ], {
        color: '#f59e0b',
        fillColor: '#fde68a',
        fillOpacity: 0.4,
        weight: 1
    }).bindPopup('<h4>Area Pemukiman Padat</h4><p>Zona Perumahan</p>');
    pemukiman1.addTo(layers.pemukiman);
    layers.pemukiman.addTo(map);

    // Sawah
    layers.sawah = L.layerGroup();
    const sawah1 = L.polygon([
        [-7.426500, 109.199500],
        [-7.426500, 109.200500],
        [-7.427500, 109.200500],
        [-7.427500, 109.199500]
    ], {
        color: '#10b981',
        fillColor: '#86efac',
        fillOpacity: 0.5,
        weight: 1
    }).bindPopup('<h4>Area Persawahan</h4><p>Lahan Pertanian Produktif</p>');
    sawah1.addTo(layers.sawah);
    layers.sawah.addTo(map);

    // Kebun/Lahan
    layers.kebun = L.layerGroup();
    const kebun1 = L.polygon([
        [-7.424500, 109.201000],
        [-7.424500, 109.202000],
        [-7.425500, 109.202000],
        [-7.425500, 109.201000]
    ], {
        color: '#84cc16',
        fillColor: '#bef264',
        fillOpacity: 0.4,
        weight: 1
    }).bindPopup('<h4>Lahan Kebun</h4><p>Area Perkebunan</p>');
    kebun1.addTo(layers.kebun);
    layers.kebun.addTo(map);

    // Add labels for desa
    const desaLabel = L.marker([-7.426000, 109.200250], {
        icon: L.divIcon({
            className: 'label-marker',
            html: '<div style="background: rgba(255,255,255,0.9); padding: 5px 10px; border-radius: 5px; font-weight: bold; color: #2563eb; border: 2px solid #2563eb; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">Karanglewas Kidul</div>',
            iconSize: [120, 30]
        })
    });
    desaLabel.addTo(map);
}

function setupControls() {
    // Sidebar toggle
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
    });

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
    document.getElementById('clearLayers').addEventListener('click', function () {
        layerToggles.forEach(toggle => {
            toggle.checked = false;
            const layerName = toggle.dataset.layer;
            if (layers[layerName]) {
                map.removeLayer(layers[layerName]);
            }
        });
    });

    // Home button
    document.getElementById('homeBtn').addEventListener('click', function () {
        map.setView([-7.425779, 109.200212], 14);
    });

    // Locate button
    document.getElementById('locateBtn').addEventListener('click', function () {
        map.locate({ setView: true, maxZoom: 14 });
    });

    map.on('locationfound', function (e) {
        L.marker(e.latlng).addTo(map)
            .bindPopup('Lokasi Anda').openPopup();
    });

    map.on('locationerror', function () {
        alert('Tidak dapat menemukan lokasi Anda');
    });

    // Search functionality
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = this.value;
            // Simple coordinate search
            if (query.includes(',')) {
                const coords = query.split(',').map(c => parseFloat(c.trim()));
                if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                    map.setView(coords, 16);
                    L.marker(coords).addTo(map)
                        .bindPopup('Hasil Pencarian').openPopup();
                }
            }
        }
    });
}

console.log('🗺️ Peta Kecamatan loaded successfully');