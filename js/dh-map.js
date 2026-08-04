// --- Country coordinates ---
const countryCoords = {
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
    .then(response => response.json())
    .then(photographers => {
        // --- Count photographers per country ---
        const countryCount = {};
        photographers.forEach(p => {
            const country = p.country;
            countryCount[country] = (countryCount[country] || 0) + 1;
        });

        // --- Initialize map ---
        const map = L.map('map').setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // --- Add markers for each country ---
        Object.entries(countryCount).forEach(([country, count]) => {
            const coords = countryCoords[country];
            if (coords) {
                const marker = L.circleMarker(coords, {
                    radius: Math.min(count * 6, 30),
                    color: '#d4c9b8',
                    weight: 1,
                    opacity: 0.8,
                    fillColor: '#d4c9b8',
                    fillOpacity: 0.4
                }).addTo(map);

                marker.bindPopup(`
                    <strong>${country}</strong><br>
                    ${count} photographer${count > 1 ? 's' : ''}
                `);
            }
        });
    })
    .catch(error => {
        console.error('Error loading data:', error);
        document.getElementById('map').innerHTML = '<p style="color:red;">Error loading data.</p>';
    });