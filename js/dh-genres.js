// --- Global variables ---
var allGenreData = {};
var allPhotographers = [];
var currentCentury = 'all';

// --- Helper function to determine which centuries a photographer belongs to ---
function getPhotographerCenturies(photographer) {
    if (!photographer.birthYear) return [];

    var birth = photographer.birthYear;
    var death = photographer.deathYear || new Date().getFullYear();
    var activeStart = birth + 16; // Age 16 - start of professional career
    var activeEnd = death;

    var centuries = [];
    var centuryRanges = [
        { num: 19, start: 1800, end: 1899 },
        { num: 20, start: 1900, end: 1999 },
        { num: 21, start: 2000, end: 2099 }
    ];

    for (var i = 0; i < centuryRanges.length; i++) {
        var c = centuryRanges[i];
        // How many years did photographer work in this century (from age 16)?
        var overlapStart = Math.max(activeStart, c.start);
        var overlapEnd = Math.min(activeEnd, c.end);
        var overlapYears = Math.max(0, overlapEnd - overlapStart);

        // If at least 10 years of activity in this century, include it
        if (overlapYears >= 10) {
            centuries.push(c.num);
        }
    }

    // If no century found (shouldn't happen), use birth century
    if (centuries.length === 0) {
        centuries.push(Math.ceil(birth / 100));
    }

    return centuries;
}

// --- Helper function to get century label ---
function getCenturyLabel(century) {
    if (century === 19) return 'XIX century (1800-1899)';
    if (century === 20) return 'XX century (1900-1999)';
    if (century === 21) return 'XXI century (2000-present)';
    return '';
}

// --- Load data from JSON ---
fetch('../data/dh_photographers.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(photographers) {
        allPhotographers = photographers;

        // --- Log which centuries each photographer belongs to ---
        console.log('=== Photographer century assignment ===');
        photographers.forEach(function(p) {
            var centuries = getPhotographerCenturies(p);
            var labels = centuries.map(function(c) { return getCenturyLabel(c); }).join(', ');
            console.log(p.name + ' → ' + labels + ' (born ' + p.birthYear + ', died ' + (p.deathYear || 'alive') + ')');
        });
        console.log('========================================');

        // --- Count genres for ALL photographers ---
        allGenreData = {};
        photographers.forEach(function(p) {
            p.genres.forEach(function(genre) {
                if (!allGenreData[genre]) {
                    allGenreData[genre] = { count: 0, names: [] };
                }
                allGenreData[genre].count += 1;
                allGenreData[genre].names.push(p.name);
            });
        });

        // --- Populate century filter dropdown ---
        var select = document.getElementById('centurySelect');
        var centuries = [
            { value: 'all', label: 'All centuries' },
            { value: '19', label: 'XIX century (1800-1899)' },
            { value: '20', label: 'XX century (1900-1999)' },
            { value: '21', label: 'XXI century (2000-present)' }
        ];
        centuries.forEach(function(c) {
            var option = document.createElement('option');
            option.value = c.value;
            option.textContent = c.label;
            select.appendChild(option);
        });

        // --- Initial render ---
        renderChart('all');

        // --- Filter change handler ---
        select.addEventListener('change', function() {
            currentCentury = this.value;
            renderChart(currentCentury);
        });
    })
    .catch(function(error) {
        console.error('Error loading data:', error);
        document.querySelector('.chart-container').innerHTML = '<p style="color:red;">Error loading data. Please check that dh_photographers.json exists.</p>';
    });

// --- Render chart function ---
function renderChart(centuryFilter) {
    var filteredData = {};

    if (centuryFilter === 'all') {
        filteredData = JSON.parse(JSON.stringify(allGenreData));
    } else {
        var centuryNum = parseInt(centuryFilter);
        // Filter photographers who belong to this century
        var filteredPhotographers = allPhotographers.filter(function(p) {
            var centuries = getPhotographerCenturies(p);
            return centuries.indexOf(centuryNum) !== -1;
        });

        console.log('Filtered photographers for ' + getCenturyLabel(centuryNum) + ':', filteredPhotographers.map(function(p) { return p.name; }));

        // Count genres for filtered photographers
        filteredPhotographers.forEach(function(p) {
            p.genres.forEach(function(genre) {
                if (!filteredData[genre]) {
                    filteredData[genre] = { count: 0, names: [] };
                }
                filteredData[genre].count += 1;
                filteredData[genre].names.push(p.name);
            });
        });
    }

    // --- Sort by frequency ---
    var sortedGenres = Object.entries(filteredData)
        .sort(function(a, b) { return b[1].count - a[1].count; });

    var labels = sortedGenres.map(function(item) { return item[0]; });
    var data = sortedGenres.map(function(item) { return item[1].count; });
    var allNames = sortedGenres.map(function(item) { return item[1].names; });

    // --- Destroy existing chart ---
    var ctx = document.getElementById('genreChart').getContext('2d');
    if (window.genreChartInstance) {
        window.genreChartInstance.destroy();
    }

    // --- Create new chart ---
    window.genreChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of photographers',
                data: data,
                backgroundColor: 'rgba(212, 201, 184, 0.7)',
                borderColor: '#d4c9b8',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#d4c9b8',
                    bodyColor: '#e0e0e0',
                    borderColor: 'rgba(212, 201, 184, 0.2)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        afterBody: function(tooltipItems) {
                            var index = tooltipItems[0].dataIndex;
                            var names = allNames[index] || [];
                            if (names.length === 0) return 'No photographers';
                            return 'Photographers:\n' + names.map(function(name) {
                                return '• ' + name;
                            }).join('\n');
                        },
                        label: function(context) {
                            return 'Count: ' + context.parsed.x;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: '#b0a392', font: { size: 12 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: { color: '#b0a392', font: { size: 13 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            }
        }
    });

    // --- Update subtitle ---
    var subtitle = document.getElementById('filterSubtitle');
    var filterInfo = document.getElementById('filterInfo');
    var totalGenres = Object.keys(filteredData).length;
    var totalPhotographers = Object.values(filteredData).reduce(function(sum, g) { return sum + g.count; }, 0);

    if (centuryFilter === 'all') {
        subtitle.textContent = 'Showing all photographers across all centuries';
        filterInfo.textContent = totalGenres + ' genres, ' + totalPhotographers + ' photographers';
    } else {
        var label = getCenturyLabel(parseInt(centuryFilter));
        subtitle.textContent = 'Showing photographers active in ' + label;
        filterInfo.textContent = totalGenres + ' genres, ' + totalPhotographers + ' photographers';
    }
}