// --- Global variables ---
var allGenreData = {};
var allPhotographers = [];
var currentCentury = 'all';

// --- Helper function to determine century ---
function getCentury(year) {
    if (!year) return null;
    var century = Math.ceil(year / 100);
    return century;
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

        // --- Count genres for ALL photographers ---
        allGenreData = {};
        photographers.forEach(function(p) {
            p.genres.forEach(function(genre) {
                if (!allGenreData[genre]) {
                    allGenreData[genre] = { count: 0, names: [], centuries: [] };
                }
                allGenreData[genre].count += 1;
                allGenreData[genre].names.push(p.name);
                allGenreData[genre].centuries.push(getCentury(p.birthYear));
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
    // --- Filter data by century ---
    var filteredData = {};

    if (centuryFilter === 'all') {
        // Use all data
        filteredData = allGenreData;
    } else {
        var centuryNum = parseInt(centuryFilter);
        // Filter photographers by century
        var filteredPhotographers = allPhotographers.filter(function(p) {
            return getCentury(p.birthYear) === centuryNum;
        });

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

    // --- Destroy existing chart if it exists ---
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

    // --- Update subtitle with filter info ---
    var subtitle = document.getElementById('filterSubtitle');
    if (centuryFilter === 'all') {
        subtitle.textContent = 'Showing all photographers across all centuries';
    } else {
        var label = getCenturyLabel(parseInt(centuryFilter));
        var count = Object.keys(filteredData).length;
        subtitle.textContent = 'Showing photographers from ' + label + ' (' + count + ' genres represented)';
    }
}