$(document).ready(function() {
    // Get photographer id from URL parameter
    var urlParams = new URLSearchParams(window.location.search);
    var targetId = urlParams.get('id');

    // Load data from persons.json using fetch
    fetch('persons.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .then(function(authorsData) {
            authorsData.forEach(function(authorData) {
                var authorName = authorData.name;
                var bio = authorData.bio;
                var imageCount = authorData.imageCount;
                var authorId = authorData.id;

                // Create header
                var head = document.createElement("div");
                head.className = 'header';
                head.append(authorName);

                // Create slider container
                var slider = document.createElement("div");
                slider.className = 'slider';
                for (var i = 1; i <= imageCount; i++) {
                    var name_file = 'Images/Persons/' + authorName.replaceAll(' ', '_') + '_Photo (' + i + ').jpg';
                    var image = document.createElement("img");
                    image.src = name_file;
                    image.className = 'slide-img';
                    slider.append(image);
                }

                // Create info block
                var info = document.createElement("div");
                info.className = 'info';
                info.append(bio);

                // Assemble structure
                var content_out = document.createElement("div");
                content_out.className = 'content';
                var content_in = document.createElement("div");
                content_in.className = 'content_in';
                content_in.append(slider);
                content_in.append(info);
                content_out.append(content_in);

                // Wrap everything into person block with id
                var pers = document.createElement("div");
                pers.className = 'person';
                pers.id = 'person-' + authorId;
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
            var Image_Index = 0;
            $('.slider img:first-child').show();

            $('.slider').click(function() {
                var images = $(this).find('img');
                if (images.length === 0) return;
                var M = (Image_Index + 1) % images.length;
                images.fadeOut('fast');
                images.eq(M).fadeIn('slow');
                Image_Index = M;
            });

            // --- AUTO-OPEN if id is specified in URL ---
            if (targetId) {
                var targetPerson = $('#person-' + targetId);
                if (targetPerson.length > 0) {
                    // Small delay to ensure everything is rendered
                    setTimeout(function() {
                        targetPerson.find('.content').slideDown('slow');
                        // Scroll to the person
                        $('html, body').animate({
                            scrollTop: targetPerson.offset().top - 50
                        }, 500);
                    }, 300);
                } else {
                    console.warn('Person not found with id:', targetId);
                }
            }
        })
        .catch(function(error) {
            console.error('Error loading persons.json:', error);
            $('.article').append('<p style="color:red; padding:20px;">Error loading data: ' + error.message + '</p>');
        });
});