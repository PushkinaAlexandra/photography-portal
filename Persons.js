$(document).ready(function() {
    // Load data from persons.json using fetch
    fetch('persons.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .then(authorsData => {
            authorsData.forEach(function(authorData) {
                let authorName = authorData.name;
                let bio = authorData.bio;
                let imageCount = authorData.imageCount;

                // Create header
                let head = document.createElement("div");
                head.className = 'header';
                head.append(authorName);

                // Create slider container
                let slider = document.createElement("div");
                slider.className = 'slider';
                for (let i = 1; i <= imageCount; i++) {
                    let name_file = 'Images/Persons/' + authorName.replaceAll(' ', '_') + '_Photo (' + i + ').jpg';
                    let image = document.createElement("img");
                    image.src = name_file;
                    image.className = 'slide-img';
                    slider.append(image);
                }

                // Create info block
                let info = document.createElement("div");
                info.className = 'info';
                info.append(bio);

                // Assemble structure
                let content_out = document.createElement("div");
                content_out.className = 'content';
                let content_in = document.createElement("div");
                content_in.className = 'content_in';
                content_in.append(slider);
                content_in.append(info);
                content_out.append(content_in);

                // Wrap everything into person block
                let pers = document.createElement("div");
                pers.className = 'person';
                pers.append(head);
                pers.append(content_out);

                $('.article').append(pers);
            });

            // --- ACCORDION LOGIC ---
            $('.article .header').click(function() {
                $(this).next('.content').slideToggle('slow');
                $(this).parent('.person').siblings('.person').children('.content').slideUp('slow');
            });

            // --- SLIDER LOGIC ---
            let Image_Index = 0;
            $('.slider img:first-child').show();

            $('.slider').click(function() {
                let images = $(this).find('img');
                if (images.length === 0) return;
                let M = (Image_Index + 1) % images.length;
                images.fadeOut('fast');
                images.eq(M).fadeIn('slow');
                Image_Index = M;
            });
        })
        .catch(error => {
            console.error('Error loading persons.json:', error);
            $('.article').append('<p style="color:red; padding:20px;">Error loading data: ' + error.message + '</p>');
        });
});