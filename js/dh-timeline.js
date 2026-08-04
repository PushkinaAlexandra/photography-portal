// --- Load data from JSON ---
fetch('../data/dh_photographers.json')
    .then(function(response) {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(function(photographers) {
        console.log('Total photographers in JSON:', photographers.length);

        // --- Prepare data for Vis Timeline ---
        var items = [];
        var currentYear = new Date().getFullYear();

        // Add photographers as range items
        photographers.forEach(function(p) {
            console.log('Processing:', p.name, 'birth:', p.birthYear, 'death:', p.deathYear);

            if (p.birthYear) {
                // Use current year if photographer is still alive
                var endYear = p.deathYear || currentYear;
                var displayEnd = p.deathYear || 'present';

                var item = {
                    id: p.id,
                    content: p.name + '<br><small>' + p.birthYear + ' - ' + displayEnd + '</small>',
                    start: new Date(p.birthYear, 0, 1),
                    end: new Date(endYear, 0, 1),
                    type: 'range',
                    className: p.deathYear ? 'photographer' : 'photographer-alive'
                };

                console.log('Created item:', item);
                items.push(item);
            } else {
                console.warn('Skipping:', p.name, '- no birth year');
            }
        });

        console.log('Total items created:', items.length);
        console.log('Items:', items);

        // --- Initialize Timeline ---
        var container = document.getElementById('timeline');

        if (!container) {
            console.error('Container #timeline not found');
            return;
        }

        console.log('Container found:', container);

        var options = {
            stack: true,
            showCurrentTime: false,
            orientation: 'top',
            height: '100%',
            min: new Date(1800, 0, 1),
            max: new Date(2030, 0, 1),
            zoomMin: 1000 * 60 * 60 * 24 * 365 * 5,
            zoomMax: 1000 * 60 * 60 * 24 * 365 * 200
        };

        console.log('Creating timeline with options:', options);

        // Create timeline instance
        var timeline = new vis.Timeline(container, items, options);

        // Fit timeline to show all items
        timeline.fit();

        console.log('Timeline created successfully');
    })
    .catch(function(error) {
        console.error('Error loading data:', error);
        var timelineElement = document.getElementById('timeline');
        if (timelineElement) {
            timelineElement.innerHTML = '<p style="color:red;">Error loading data. Please check that dh_photographers.json exists.</p>';
        }
    });