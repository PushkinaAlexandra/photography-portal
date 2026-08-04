// --- Load data from JSON ---
fetch('../data/dh_photographers.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(photographers) {
        // --- Prepare data for Vis Timeline ---
        var items = [];
        var currentYear = new Date().getFullYear();

        // Add photographers as range items
        photographers.forEach(function(p) {
            if (p.birthYear) {
                // Use current year if photographer is still alive
                var endYear = p.deathYear || currentYear;
                var displayEnd = p.deathYear || 'present';

                items.push({
                    id: p.id,
                    content: p.name + '<br><small>' + p.birthYear + ' - ' + displayEnd + '</small>',
                    start: new Date(p.birthYear, 0, 1),
                    end: new Date(endYear, 0, 1),
                    type: 'range',
                    className: p.deathYear ? 'photographer' : 'photographer-alive'
                });
            }
        });

        console.log('Total photographers displayed:', items.length);

        // --- Initialize Timeline ---
        var container = document.getElementById('timeline');

        if (!container) {
            console.error('Container #timeline not found');
            return;
        }

        var options = {
            stack: true,
            showCurrentTime: false,
            orientation: 'top',
            height: '100%',
            min: new Date(1800, 0, 1),
            max: new Date(2030, 0, 1),
            zoomMin: 1000 * 60 * 60 * 24 * 365 * 5, // 5 years minimum zoom
            zoomMax: 1000 * 60 * 60 * 24 * 365 * 200 // 200 years maximum zoom
        };

        // Create timeline instance
        var timeline = new vis.Timeline(container, items, options);

        // Fit timeline to show all items
        timeline.fit();
    })
    .catch(function(error) {
        console.error('Error loading data:', error);
        var timelineElement = document.getElementById('timeline');
        if (timelineElement) {
            timelineElement.innerHTML = '<p style="color:red;">Error loading data. Please check that dh_photographers.json exists.</p>';
        }
    });