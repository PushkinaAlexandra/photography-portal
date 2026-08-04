// --- Load data from JSON ---
fetch('../data/dh_photographers.json')
    .then(response => response.json())
    .then(photographers => {
        // --- Count genres ---
        const genreCount = {};
        photographers.forEach(p => {
            p.genres.forEach(genre => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        });

        // --- Sort by frequency ---
        const sortedGenres = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1]);

        const labels = sortedGenres.map(item => item[0]);
        const data = sortedGenres.map(item => item[1]);

        // --- Render chart ---
        const ctx = document.getElementById('genreChart').getContext('2d');
        new Chart(ctx, {
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
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#b0a392' }
                    },
                    x: {
                        ticks: { color: '#b0a392', maxRotation: 45 }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error loading data:', error);
        document.querySelector('.chart-container').innerHTML = '<p style="color:red;">Error loading data. Please check that dh_photographers.json exists.</p>';
    });