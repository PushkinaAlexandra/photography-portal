$(document).ready(function() {
    let sizer = 'sizer4';
    let container = $('.gallery');

    // --- Загружаем данные из gallery.json ---
    fetch('gallery.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .then(items => {
            // --- Строим галерею из загруженных данных ---
            items.forEach(function(item) {
                let photo = document.createElement("img");
                photo.src = `Images/Gallery/${item.filename}`;
                photo.id = item.filename;
                photo.alt = item.title;

                let div_name = document.createElement("div");
                div_name.className = 'cover_name';
                let Author_p = document.createElement("p");
                Author_p.textContent = item.author;
                let Name_p = document.createElement("p");
                Name_p.textContent = item.title;
                div_name.append(Author_p, Name_p);

                let div_photo = document.createElement("div");
                // Класс для Masonry + класс автора для фильтрации (как в старом коде)
                div_photo.className = `item-masonry ${sizer} ${item.author.replaceAll(' ', '')}`;
                div_photo.append(photo, div_name);
                container.append(div_photo);
            });

            // --- Masonry ---
            container.imagesLoaded(function() {
                container.masonry({
                    itemSelector: '.item-masonry',
                    columnWidth: '.' + sizer,
                    percentPosition: true
                });
            });

            // --- Hover эффект ---
            $('.item-masonry').hover(
                function() {
                    $(this).find('.cover_name').fadeIn();
                },
                function() {
                    $(this).find('.cover_name').fadeOut();
                }
            );

            // --- Собираем уникальных авторов для фильтра ---
            let authors = [...new Set(items.map(item => item.author))].sort();

            // --- Заполняем выпадающий список ---
            authors.forEach(function(auth) {
                let option = document.createElement("option");
                option.value = auth;
                option.textContent = auth;
                $('#authors_select').append(option);
            });

            // --- Логика фильтрации (ТОЧНО КАК В ТВОЁМ СТАРОМ КОДЕ) ---
            document.f.s_authors.addEventListener('change', function() {
                let ch_auth = this.value;

                // Скрываем все элементы
                $('.item-masonry').css('display', 'none');

                if (ch_auth !== 'none') {
                    // Показываем только выбранного автора
                    let selector = '.item-masonry.' + ch_auth.replaceAll(' ', '');
                    $(selector).css('display', 'block');
                } else {
                    // Показываем все
                    $('.item-masonry').css('display', 'block');
                }

                // Перестраиваем Masonry
                container.imagesLoaded(function() {
                    container.masonry('reloadItems');
                    container.masonry('layout');
                });
            });

            // --- Инициализация: показываем все элементы ---
            $('.item-masonry').css('display', 'block');

        })
        .catch(error => {
            console.error('Error loading gallery.json:', error);
            container.append('<p style="color:red; padding:20px;">Error loading gallery data: ' + error.message + '</p>');
        });
});