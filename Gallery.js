$(document).ready(function() {

    let text = `Photo (1).webp, Author: Nadar, Name: Self-portrait
Photo (2).webp, Author: Steve McCurry, Name: Afghan Girl
Photo (3).webp, Author: Ernst Hass, Name: La Suerte De Capa
Photo (4).webp, Author: Eve Arnold, Name: Malcom X
Photo (1).jpg, Author: Julia Margaret Cameron, Name: I'm waiting
Photo (2).jpg, Author: Edward Burtynsky, Name: Salt Pans
Photo (3).jpg, Author: Andreas Gurski, Name: Amazon
Photo (4).jpg, Author: Jeff Wall, Name: A Sudden Gust of Wind
Photo (5).jpg, Author: Richard Drew, Name: The Falling Man
Photo (6).jpg, Author: Gregory Crewdson, Name: Beneath the roses
Photo (7).jpg, Author: Gillian Wearing, Name: Everything is connected in life
Photo (8).jpg, Author: Thomas Struth, Name: Pergamon Museum I
Photo (9).jpg, Author: Andy Warhol, Name: Self-portrait
Photo (10).jpg, Author: Ian Berry, Name: View of the harbor at Whitby
Photo (11).jpg, Author: William Anders, Name: Earthrise
Photo (12).jpg, Author: Dorotea Lange, Name: Migrant Mother
Photo (13).jpg, Author: Slim Aarons, Name: Hepburn and friends
Photo (14).jpg, Author: Alexander Rodchenko, Name: Portrait of a mother
Photo (15).jpg, Author: Robert Doisneau, Name: Kiss at City Hall
Photo (16).jpg, Author: Elliott Erwitt, Name: Finland
Photo (1).jpeg, Author: Elliott Erwitt, Name: Paris. France
Photo (17).jpg, Author: Henri Cartier Bresson, Name: Man riding a bicycle
Photo (18).jpg, Author: Elliott Erwitt, Name: Empire State Building
Photo (19).jpg, Author: Steve McCurry, Name: Kabul. Afghanistan
Photo (20).jpg, Author: Henri Cartier Bresson, Name: France
Photo (21).jpg, Author: Alexander Rodchenko, Name: Jump into water
Photo (22).jpg, Author: Steve McCurry, Name: Pul i Khumri
Photo (23).jpg, Author: Elliott Erwitt, Name: Third Avenue
Photo (24).jpg, Author: Steve McCurry, Name: Mazar-i-Sharif
Photo (25).jpg, Author: Alexander Rodchenko, Name: Stairs
Photo (26).jpg, Author: Henri Cartier Bresson, Name: Under the drizzling rain
Photo (27).jpg, Author: Henri Cartier Bresson, Name: Jean Polan`;

    let authorsList = `Alexander Rodchenko
Andreas Gurski
Andy Warhol
Dorotea Lange
Edward Burtynsky
Elliott Erwitt
Ernst Hass
Eve Arnold
Gillian Wearing
Gregory Crewdson
Henri Cartier Bresson
Ian Berry
Jeff Wall
Julia Margaret Cameron
Nadar
Richard Drew
Robert Doisneau
Slim Aarons
Steve McCurry
Thomas Struth
William Anders`;

    let sizer = 'sizer4';
    let container = $('.gallery');

    function getPhotoData(id_name) {
        let start = text.indexOf(id_name);
        if (start === -1) return null;

        let authorStart = start + id_name.length + ', Author: '.length;
        let authorEnd = text.indexOf(',', authorStart);
        let author = text.slice(authorStart, authorEnd).trim();

        let nameStart = authorEnd + ', Name: '.length;
        let nameEnd = text.indexOf('\n', nameStart);
        if (nameEnd === -1) nameEnd = text.length;
        let name = text.slice(nameStart, nameEnd).trim();

        return { author, name };
    }

    function addImages(extension, count) {
        for (let i = 1; i <= count; i++) {
            let id_name = `Photo (${i}).${extension}`;
            let data = getPhotoData(id_name);
            if (!data) continue;

            let photo = document.createElement("img");
            photo.src = `Images/Gallery/${id_name}`;
            photo.id = id_name;
            photo.alt = data.name;

            let div_name = document.createElement("div");
            div_name.className = 'cover_name';
            let Author_p = document.createElement("p");
            Author_p.textContent = data.author;
            let Name_p = document.createElement("p");
            Name_p.textContent = data.name;
            div_name.append(Author_p, Name_p);

            let div_photo = document.createElement("div");
            div_photo.className = `item-masonry ${sizer} ${data.author.replaceAll(' ', '')}`;
            div_photo.append(photo, div_name);
            container.append(div_photo);
        }
    }

    addImages('webp', 4);
    addImages('jpg', 27);
    addImages('jpeg', 1);

    container.imagesLoaded(function() {
        container.masonry({
            itemSelector: '.item-masonry',
            columnWidth: '.' + sizer,
            percentPosition: true
        });
    });

    $('.item-masonry').hover(
        function() {
            $(this).find('.cover_name').fadeIn();
        },
        function() {
            $(this).find('.cover_name').fadeOut();
        }
    );

    let authors = authorsList.split('\n').filter(a => a.trim());
    authors.forEach(function(auth) {
        let option = document.createElement("option");
        option.value = auth;
        option.textContent = auth;
        $('#authors_select').append(option);
    });

    document.f.s_authors.addEventListener('change', function() {
        let ch_auth = this.value;

        $('.item-masonry').css('display', 'none');

        if (ch_auth !== 'none') {
            let selector = '.item-masonry.' + ch_auth.replaceAll(' ', '');
            $(selector).css('display', 'block');
        } else {
            $('.item-masonry').css('display', 'block');
        }

        container.imagesLoaded(function() {
            container.masonry('reloadItems');
            container.masonry('layout');
        });
    });

    $('.item-masonry').css('display', 'block');
});