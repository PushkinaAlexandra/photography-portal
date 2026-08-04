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
// Try multiple possible paths
var jsonPath = '../data/dh_photographers.json';

console.log('Attempting to load:', jsonPath);

fetch(jsonPath)
    .then(function(response) {
        console.log('Response status:', response.status);
        console.log('Response URL:', response.url);

        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status + ' - ' + response.statusText);
        }
        return response.json();
    })
    .then(function(photographers) {
        console.log('Loaded', photographers.length, 'photographers');

        // --- Count photographers per country ---
        var countryCount = {};
        photographers.forEach(function(p) {
            var country = p.country;
            countryCount[country] = (countryCount[country] || 0) + 1;
        });

        console.log('Country counts:', countryCount);

        // --- Initialize map ---
        var map = L.map('map').setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // --- Add markers for each country ---
        Object.keys(countryCount).forEach(function(country) {
            var count = countryCount[country];
            var coords = countryCoords[country];

            if (coords) {
                var marker = L.circleMarker(coords, {
                    radius: Math.min(count * 6, 30),
                    color: '#d4c9b8',
                    weight: 1,
                    opacity: 0.8,
                    fillColor: '#d4c9b8',
                    fillOpacity: 0.4
                }).addTo(map);

                marker.bindPopup(
                    '<strong>' + country + '</strong><br>' +
                    count + ' photographer' + (count > 1 ? 's' : '')
                );
            } else {
                console.warn('No coordinates for country:', country);
            }
        });

        console.log('Map initialized successfully');
    })
    .catch(function(error) {
        console.error('Error loading data:', error);
        var mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.innerHTML = '<p style="color:red;">Error loading data. Please check that dh_photographers.json exists at: ' + jsonPath + '</p>';
        }
    });