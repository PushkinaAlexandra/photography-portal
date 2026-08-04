// --- Global variables ---
var allGenreData = {};
var allPhotographers = [];
var currentCentury = 'all';

// --- Helper function to determine which century a photographer belongs to ---
function getPhotographerCentury(photographer) {
    if (!photographer.birthYear) return null;

    var birth = photographer.birthYear;
    var death = photographer.deathYear || new Date().getFullYear();
    var activeStart = birth + 16; // Age 16 - start of professional career

    // Check each century
    var centuries = [
        { num: 19, start: 1800, end: 1899 },
        { num: 20, start: 1900, end: 1999 },
        { num: 21, start: 2000, end: 2099 }
    ];

    var bestCentury = null;
    var maxOverlap = 0;

    for (var i = 0; i < centuries.length; i++) {
        var c = centuries[i];
        // How many years did photographer live in this century (from age 16)?
        var overlapStart = Math.max(activeStart, c.start);
        var overlapEnd = Math.min(death, c.end);
        var overlapYears = Math.max(0, overlapEnd - overlapStart);

        if (overlapYears > maxOverlap) {
            maxOverlap = overlapYears;
            bestCentury = c.num;
        }
    }

    // If still null, fallback to birth century
    if (bestCentury === null) {
        bestCentury = Math.ceil(birth / 100);
    }

    // Special case: if photographer is alive and born after 1950,
    // they likely belong to XXI century
    if (photographer.deathYear === null && birth >= 1950) {
        var currentYear = new Date().getFullYear();
        var yearsIn21 = currentYear - Math.max(activeStart, 2000);
        var yearsIn20 = Math.min(1999, activeStart) - Math.max(birth, 1900);
        if (yearsIn21 > yearsIn20) {
            bestCentury = 21;
        }
    }

    return bestCentury;
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

        // --- Log which century each photographer belongs to (for debugging) ---
        console.log('=== Photographer century assignment ===');
        photographers.forEach(function(p) {
            var century = getPhotographerCentury(p);
            console.log(p.name + ' → ' + getCenturyLabel(century) + ' (born ' + p.birthYear + ', died ' + (p.deathYear || 'alive') + ')');
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
        // Filter photographers by their active century
        var filteredPhotographers = allPhotographers.filter(function(p) {
            return getPhotographerCentury(p) === centuryNum;
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
        subtitle.textContent = 'Showing photographers active in ' + label + ' (age 16+)';
        filterInfo.textContent = totalGenres + ' genres, ' + totalPhotographers + ' photographers';
    }
}