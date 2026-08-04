// --- Global variables ---
var network = null;
var allNodes = [];
var allEdges = [];
var allPhotographers = [];

// --- Helper: get unique color for a group ---
function getGroupColor(groupName) {
    var colors = {
        'Magnum Photos': '#d4c9b8',
        'October Group': '#c9b8a4',
        'Constructivists': '#b8c9a4',
        'Düsseldorf School of Photography': '#a4b8c9',
        'The Factory': '#c9a4b8',
        'Farm Security Administration (FSA)': '#a4c9b8',
        'Groupe des XV': '#b8a4c9',
        'Young British Artists (YBAs)': '#c9b8a4',
        'Vancouver School': '#a4b8c9',
        'Associated Press': '#b8c9a4',
        'NASA Astronaut Group 3': '#c9a4b8'
    };
    return colors[groupName] || '#d4c9b8';
}

// --- Helper: get century label ---
function getCenturyLabel(year) {
    if (!year) return '';
    var c = Math.ceil(year / 100);
    if (c === 19) return 'XIX';
    if (c === 20) return 'XX';
    if (c === 21) return 'XXI';
    return '';
}

// --- Load data ---
fetch('../data/dh_photographers.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(photographers) {
        allPhotographers = photographers;
        buildNetwork('all');
    })
    .catch(function(error) {
        console.error('Error loading data:', error);
        document.getElementById('network').innerHTML = '<p style="color:red;padding:20px;">Error loading data. Please check that dh_photographers.json exists.</p>';
    });

// --- Build network function ---
function buildNetwork(filter) {
    var nodes = [];
    var edges = [];
    var nodeIds = new Set();
    var photographerIds = new Set();

    // --- 1. Add photographers as nodes ---
    allPhotographers.forEach(function(p) {
        var century = getCenturyLabel(p.birthYear);
        var label = p.name;
        if (century) {
            label += '\n(' + century + ' c.)';
        }

        nodes.push({
            id: p.id,
            label: label,
            group: 'photographer',
            title: p.name + '\n' + p.birthYear + '–' + (p.deathYear || 'present') + '\n' + p.country + '\n' + p.genres.join(', '),
            shape: 'dot',
            size: 14,
            font: { color: '#e0e0e0', size: 12 },
            color: { background: '#4a6a8a', border: '#d4c9b8' }
        });
        nodeIds.add(p.id);
        photographerIds.add(p.id);
    });

    // --- Track which groups to add ---
    var groupsMap = {};
    var teacherMap = {};

    // --- 2. Add groups and connections ---
    allPhotographers.forEach(function(p) {
        p.groups.forEach(function(group) {
            var groupId = 'group_' + group.replace(/\s+/g, '_');
            if (!groupsMap[groupId]) {
                groupsMap[groupId] = group;
                nodes.push({
                    id: groupId,
                    label: group,
                    group: 'group',
                    shape: 'box',
                    size: 20,
                    font: { color: '#1a1a1a', size: 14, face: 'Playfair Display', bold: true },
                    color: { background: getGroupColor(group), border: '#d4c9b8' }
                });
                nodeIds.add(groupId);
            }
            // Edge: photographer → group
            edges.push({
                from: p.id,
                to: groupId,
                label: 'member',
                color: { color: 'rgba(212, 201, 184, 0.4)' },
                dashes: false,
                width: 1
            });
        });
    });

    // --- 3. Add Magnum Photos connections ---
    var magnumGroupId = 'group_Magnum_Photos';
    allPhotographers.forEach(function(p) {
        if (p.magnum) {
            // Make sure Magnum group exists
            if (!groupsMap[magnumGroupId]) {
                groupsMap[magnumGroupId] = 'Magnum Photos';
                nodes.push({
                    id: magnumGroupId,
                    label: 'Magnum Photos',
                    group: 'group',
                    shape: 'box',
                    size: 24,
                    font: { color: '#1a1a1a', size: 16, face: 'Playfair Display', bold: true },
                    color: { background: '#d4c9b8', border: '#d4c9b8' }
                });
                nodeIds.add(magnumGroupId);
            }
            // Edge: photographer → Magnum (special style)
            edges.push({
                from: p.id,
                to: magnumGroupId,
                label: 'Magnum',
                color: { color: '#d4c9b8' },
                dashes: [5, 5],
                width: 2
            });
        }
    });

    // --- 4. Add teacher-student connections ---
    allPhotographers.forEach(function(p) {
        if (p.teachers && p.teachers.length > 0) {
            p.teachers.forEach(function(teacherId) {
                var teacher = allPhotographers.find(function(t) { return t.id === teacherId; });
                if (teacher) {
                    var edgeId = p.id + '_' + teacherId;
                    edges.push({
                        id: edgeId,
                        from: p.id,
                        to: teacherId,
                        label: 'taught by',
                        color: { color: '#8a4a6a' },
                        dashes: false,
                        width: 2,
                        arrows: { to: { enabled: true, scaleFactor: 0.8 } }
                    });
                } else {
                    console.warn('Teacher not found:', teacherId, 'for', p.name);
                }
            });
        }
    });

    // --- 5. Add genres as nodes ---
    var genreNodes = {};
    allPhotographers.forEach(function(p) {
        p.genres.forEach(function(genre) {
            var genreId = 'genre_' + genre.replace(/\s+/g, '_');
            if (!genreNodes[genreId]) {
                genreNodes[genreId] = genre;
                nodes.push({
                    id: genreId,
                    label: genre,
                    group: 'genre',
                    shape: 'ellipse',
                    size: 16,
                    font: { color: '#e0e0e0', size: 11 },
                    color: { background: 'rgba(138, 106, 74, 0.4)', border: '#8a6a4a' }
                });
                nodeIds.add(genreId);
            }
            // Edge: photographer → genre
            edges.push({
                from: p.id,
                to: genreId,
                label: '',
                color: { color: 'rgba(138, 106, 74, 0.3)' },
                dashes: false,
                width: 1
            });
        });
    });

    // --- 6. Add techniques as nodes ---
    var techniqueNodes = {};
    allPhotographers.forEach(function(p) {
        if (p.techniques) {
            p.techniques.forEach(function(technique) {
                var techId = 'tech_' + technique.replace(/\s+/g, '_');
                if (!techniqueNodes[techId]) {
                    techniqueNodes[techId] = technique;
                    nodes.push({
                        id: techId,
                        label: technique,
                        group: 'technique',
                        shape: 'diamond',
                        size: 14,
                        font: { color: '#e0e0e0', size: 10 },
                        color: { background: 'rgba(106, 138, 74, 0.4)', border: '#6a8a4a' }
                    });
                    nodeIds.add(techId);
                }
                // Edge: photographer → technique
                edges.push({
                    from: p.id,
                    to: techId,
                    label: '',
                    color: { color: 'rgba(106, 138, 74, 0.25)' },
                    dashes: false,
                    width: 1
                });
            });
        }
    });

    // --- 7. Apply filter ---
    var filteredNodeIds = new Set();
    var filteredEdgeIds = new Set();

    if (filter === 'all') {
        // Use all nodes and edges
        filteredNodeIds = nodeIds;
        edges.forEach(function(e) { filteredEdgeIds.add(e.id || e.from + '_' + e.to); });
    } else if (filter === 'magnum') {
        // Only show Magnum members and the Magnum node
        var magnumId = 'group_Magnum_Photos';
        allPhotographers.forEach(function(p) {
            if (p.magnum) {
                filteredNodeIds.add(p.id);
                // Add all connected nodes
                edges.forEach(function(e) {
                    if (e.from === p.id && e.to === magnumId) {
                        filteredNodeIds.add(magnumId);
                    }
                });
            }
        });
        // Add Magnum node
        filteredNodeIds.add(magnumId);
    } else if (filter === 'teachers') {
        // Only show teacher-student connections
        edges.forEach(function(e) {
            if (e.label === 'taught by' || e.label === 'student of') {
                filteredNodeIds.add(e.from);
                filteredNodeIds.add(e.to);
                filteredEdgeIds.add(e.id || e.from + '_' + e.to);
            }
        });
    } else if (filter === 'groups') {
        // Only show group connections
        edges.forEach(function(e) {
            if (e.label === 'member' && e.to && e.to.startsWith('group_')) {
                filteredNodeIds.add(e.from);
                filteredNodeIds.add(e.to);
                filteredEdgeIds.add(e.id || e.from + '_' + e.to);
            }
        });
    } else if (filter === 'genres') {
        // Only show genre connections
        edges.forEach(function(e) {
            if (e.to && e.to.startsWith('genre_')) {
                filteredNodeIds.add(e.from);
                filteredNodeIds.add(e.to);
                filteredEdgeIds.add(e.id || e.from + '_' + e.to);
            }
        });
    } else if (filter === 'techniques') {
        // Only show technique connections
        edges.forEach(function(e) {
            if (e.to && e.to.startsWith('tech_')) {
                filteredNodeIds.add(e.from);
                filteredNodeIds.add(e.to);
                filteredEdgeIds.add(e.id || e.from + '_' + e.to);
            }
        });
    }

    // --- Filter nodes ---
    var filteredNodes = nodes.filter(function(n) {
        return filteredNodeIds.has(n.id);
    });

    var filteredEdges = edges.filter(function(e) {
        var edgeId = e.id || e.from + '_' + e.to;
        if (filter === 'all') return true;
        if (filter === 'magnum') {
            var fromIn = filteredNodeIds.has(e.from);
            var toIn = filteredNodeIds.has(e.to);
            return fromIn && toIn;
        }
        return filteredEdgeIds.has(edgeId);
    });

    // --- Update filter info ---
    var info = document.getElementById('filterInfo');
    var labels = {
        'all': 'Showing all connections',
        'magnum': 'Showing Magnum Photos members',
        'teachers': 'Showing teacher-student relationships',
        'groups': 'Showing group memberships',
        'genres': 'Showing genre connections',
        'techniques': 'Showing technique connections'
    };
    info.textContent = labels[filter] || '';

    // --- Initialize network ---
    var container = document.getElementById('network');

    if (network) {
        network.destroy();
    }

    var data = {
        nodes: new vis.DataSet(filteredNodes),
        edges: new vis.DataSet(filteredEdges)
    };

    var options = {
        nodes: {
            shape: 'dot',
            size: 12,
            font: { color: '#e0e0e0', size: 12 },
            borderWidth: 1,
            borderColor: 'rgba(212, 201, 184, 0.3)'
        },
        edges: {
            smooth: { type: 'continuous', roundness: 0.2 },
            font: { color: '#666', size: 9, align: 'middle' }
        },
        physics: {
            enabled: true,
            stabilization: {
                iterations: 50,
                updateInterval: 25
            },
            barnesHut: {
                gravitationalConstant: -8000,
                centralGravity: 0.3,
                springLength: 120,
                springConstant: 0.04,
                damping: 0.09
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            navigationButtons: true,
            keyboard: true
        },
        groups: {
            photographer: {
                color: { background: '#4a6a8a', border: '#d4c9b8' },
                shape: 'dot',
                size: 14
            },
            group: {
                color: { background: '#d4c9b8', border: '#d4c9b8' },
                shape: 'box',
                size: 20,
                font: { color: '#1a1a1a', size: 14, face: 'Playfair Display', bold: true }
            },
            genre: {
                color: { background: 'rgba(138, 106, 74, 0.4)', border: '#8a6a4a' },
                shape: 'ellipse',
                size: 16
            },
            technique: {
                color: { background: 'rgba(106, 138, 74, 0.4)', border: '#6a8a4a' },
                shape: 'diamond',
                size: 14
            }
        }
    };

    network = new vis.Network(container, data, options);
}

// --- Filter change handler ---
document.addEventListener('DOMContentLoaded', function() {
    var select = document.getElementById('filterSelect');
    select.addEventListener('change', function() {
        buildNetwork(this.value);
    });
});