// --- Country coordinates ---
var countryCoords = {
    'Russia': [55.76, 37.62],
    'France': [46.60, 2.21],
    'Germany': [51.16, 10.45],
    'United States': [37.09, -95.71],
    'Canada': [56.13, -106.35],
    'Austria': [47.52, 14.55],
    'United Kingdom': [55.38, -3.44]
};

// --- Load data ---
fetch('../data/dh_photographers.json')
    .then(function(response) {
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        return response.json();
    })
    .then(function(photographers) {
        // --- Count photographers per country and store names ---
        var countryData = {};
        photographers.forEach(function(p) {
            if (!countryData[p.country]) {
                countryData[p.country] = { count: 0, names: [] };
            }
            countryData[p.country].count += 1;
            countryData[p.country].names.push(p.name);
        });

        // --- Initialize map ---
        var map = L.map('map', {
            attributionControl: false
        }).setView([20, 0], 2);

        // --- Add custom attribution ---
        L.control.attribution({
            position: 'bottomright',
            prefix: false
        }).addTo(map);

        // --- Use OpenStreetMap tiles ---
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
            maxZoom: 19
        }).addTo(map);

        // --- Add markers for each country ---
        Object.keys(countryData).forEach(function(country) {
            var data = countryData[country];
            var coords = countryCoords[country];

            if (coords) {
                var marker = L.circleMarker(coords, {
                    radius: Math.min(data.count * 6, 30),
                    color: '#d4c9b8',
                    weight: 1.5,
                    opacity: 0.8,
                    fillColor: '#d4c9b8',
                    fillOpacity: 0.3
                }).addTo(map);

                // Create popup with list of photographers
                var namesList = data.names.map(function(name) {
                    return '• ' + name;
                }).join('<br>');

                marker.bindPopup(
                    '<strong>' + country + '</strong><br>' +
                    data.count + ' photographer' + (data.count > 1 ? 's' : '') +
                    '<br><br>' + namesList
                );
            }
        });
    })
    .catch(function(error) {
        console.error('Error loading data:', error);
        var mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.innerHTML = '<p style="color:red;">Error loading data.</p>';
        }
    });