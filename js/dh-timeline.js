// --- Load data from JSON ---
fetch('../data/dh_photographers.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(photographers) {
        // --- Prepare data for Vis Timeline ---
        var items = [];

        // Add photographers as range items
        photographers.forEach(function(p) {
            if (p.birthYear && p.deathYear) {
                items.push({
                    id: p.id,
                    content: p.name + '<br><small>' + p.birthYear + ' - ' + p.deathYear + '</small>',
                    start: p.birthYear,
                    end: p.deathYear,
                    type: 'range',
                    className: 'photographer'
                });
            }
        });

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
            height: '100%'
        };

        // Create timeline instance
        var timeline = new vis.Timeline(container, items, options);

        // --- Add legend ---
        var legend = document.createElement('div');
        legend.style.marginTop = '10px';
        legend.style.color = '#b0a392';
        legend.innerHTML = '<span style="display:inline-block;background:#4a6a8a;width:20px;height:20px;border-radius:4px;vertical-align:middle;"></span> Photographer lifespan';
        container.parentNode.insertBefore(legend, container.nextSibling);
    })
    .catch(function(error) {
        console.error('Error loading data:', error);
        var timelineElement = document.getElementById('timeline');
        if (timelineElement) {
            timelineElement.innerHTML = '<p style="color:red;">Error loading data.</p>';
            }
    });