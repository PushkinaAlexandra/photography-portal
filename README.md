# 📸 Photography Portal — Digital Humanities Project

**Live Demo:** [https://pushkinaalexandra.github.io/photography-portal/](https://pushkinaalexandra.github.io/photography-portal/)

An interactive educational platform exploring the history of photography through both static content and dynamic data visualizations. This project combines a classical content site with a Digital Humanities module, offering multiple ways to explore the lives, works, and connections of 21 influential photographers.

---

## ✨ Features

### 📚 Static Content
- **Persons** — biographies of 21 photographers with interactive photo sliders; supports deep-linking from the Timeline.
- **Gallery** — Masonry grid gallery with author filter and hover overlays.
- **Genres** — overview of 4 major genres (Portrait, Landscape, Street, Documentary) with side navigation.
- **Techniques** — history of 11 photographic processes (from Camera Obscura to Digital) with side navigation.

### 📊 Digital Humanities Module (Interactive Visualizations)
- **Genres Distribution** — interactive bar chart showing how many photographers worked in each genre; filterable by century (XIX, XX, XXI).
- **Timeline** — interactive lifeline of photographers; click on a name to open their biography.
- **Map** — world map with markers showing photographers' birthplaces; popups list names.
- **Network Graph** — force-directed graph showing connections between photographers, groups, Magnum Photos, genres, and techniques; filterable by connection type.

---

## 🛠️ Technologies Used

| Component | Technology | Purpose |
|-----------|------------|---------|
| Data Visualization | Chart.js | Bar charts |
| Timeline | Vis.js (Timeline) | Interactive timeline |
| Network Graph | Vis.js (Network) | Connection mapping |
| Maps | Leaflet + OpenStreetMap | Interactive maps |
| Gallery | Masonry + imagesLoaded | Grid layout |
| Interactivity | jQuery | DOM manipulation |
| Typography | Google Fonts (Playfair Display) | Headings |
| Icons | Font Awesome | UI icons |

---

## 📂 Project Structure
photography-portal/
├── dh/ # Digital Humanities module
│ ├── dh-explorer.html # Main DH landing page
│ ├── dh-genres.html # Genre distribution chart
│ ├── dh-timeline.html # Photographer timeline
│ ├── dh-map.html # Birthplaces map
│ └── dh-network.html # Network graph
├── js/ # JavaScript for DH module
├── data/
│ └── dh_photographers.json # Structured data for 21 photographers
├── index.html # Main site
├── Persons.html # Photographer biographies
├── Gallery.html # Photo gallery
├── Genre.html # Photography genres
├── Technique.html # Technical processes
├── persons.json # Data for biographies
├── gallery.json # Gallery data
└── *.css / *.js # Styles and scripts

---

## 🗂️ Data Structure

### `dh_photographers.json` (21 photographers)

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (e.g., `cartier-bresson`) |
| `name` | Full name |
| `birthYear` / `deathYear` | Years of birth and death |
| `country` | Country of birth |
| `genres` | Array of genres (e.g., `["Street photography", "Documentary"]`) |
| `techniques` | Array of techniques (e.g., `["35mm film", "Leica camera"]`) |
| `groups` | Array of groups (e.g., `["Magnum Photos"]`) |
| `teachers` / `students` | Arrays of IDs for educational connections |
| `magnum` | Boolean indicating Magnum Photos membership |

---

## 🚀 How to Run Locally

1. Clone the repository
2. Use any HTTP server (Python, VS Code Live Server, IntelliJ built-in server)
3. Open `index.html` in your browser
🎯 Key Features in Detail
1. Smart Century Filtering (Genres Chart)
Photographers can belong to multiple centuries if they were active (from age 16) for at least 10 years in each century. This ensures accurate representation for long-lived photographers.

2. Linked Timeline & Biographies
Click on any photographer's name in the timeline → opens Persons.html with the correct biography automatically expanded and scrolled to.

3. Network Graph
    Visualizes four types of connections:
  
        Photographer → Group (6 groups)
        
        Photographer → Magnum Photos (7 members)
        
        Photographer → Genre
        
        Photographer → Technique
  
    Filters allow focusing on specific connection types.

4. Interactive Map
Markers scale by the number of photographers in each country; popups list all names.

📝 Author
Alexandra Pushkina

🏷️ Tags
Digital Humanities Art History Photography Data Visualization GLAM Interactive Gallery Timeline Network Graph Mapping Chart.js Vis.js Leaflet Masonry jQuery HTML CSS JavaScript
