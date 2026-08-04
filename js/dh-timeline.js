fetch('../data/dh_photographers.json')
    .then(response => response.json())
    .then(photographers => {
        // --- Prepare data for Vis Timeline ---
        const items = [];

        // Add photographers
        photographers.forEach(p => {
            if (p.birthYear && p.deathYear) {
                items.push({
                    id: p.id,
                    content: `${p.name}<br><small>${p.birthYear}–${p.deathYear}</small>`,
                    start: p.birthYear,
                    end: p.deathYear,
                    type: 'range',
                    className: 'photographer',
                    style: 'background-color: #4a6a8a; border-color: #4a6a8a;'
                });
            }
        });

        // --- Initialize Timeline ---
        const container = document.getElementById('timeline');
        const options = {
            stack: true,
            showCurrentTime: false,
            orientation: 'top',
            groupOrder: 'content',
            height: '100%'
        };

        const timeline = new vis.Timeline(container, items, options);

        // --- Add legend ---
        const legend = document.createElement('div');
        legend.style.marginTop = '10px';
        legend.style.color = '#b0a392';
        legend.innerHTML = `
            <span style="display:inline-block;background:#4a6a8a;width:20px;height:20px;border-radius:4px;vertical-align:middle;"></span> Photographer lifespan
        `;
        container.parentNode.insertBefore(legend, container.nextSibling);
    })
    .catch(error => {
        console.error('Error loading data:', error);
        document.getElementById('timeline').innerHTML = '<p style="color:red;">Error loading data.</p>';
    });