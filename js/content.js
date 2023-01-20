export function liveSearch() {
    const newsGroupCard = document.querySelector('.news-group-card');
    const newsCardTemplate = document.getElementById('news-card');
    const alertCard = document.querySelector('.alert-card');
    const notFoundCard = document.querySelector('.notFound-card');
    const searchInput = document.getElementById('searchInput');
    const urlHeadline = 'https://newsapi.org/v2/top-headlines?country=id&apiKey=1ec087e86b5143d28480549839fbe11c'
    let urlEvery = 'https://newsapi.org/v2/everything?q=blitar&apiKey=1ec087e86b5143d28480549839fbe11c'
    let url = '';
    let value;
    let news = [];

    // Live search
    searchInput.addEventListener('input', e => {
        value = e.target.value.toLowerCase();
        news.forEach(e => {
            let isMatch = e.title.toLowerCase().includes(value);
            e.templateElement.classList.toggle('hide', !isMatch);
            notFoundCard.classList.toggle('hide', isMatch); // JIKA DATA TIDAK SESUAI
        })

    })

    // AMBIL DATA MELALUI API
    alertCard.classList.remove('hide'); // LOADING
    fetch(urlHeadline)
        .then(res => res.json())
        .then(function renderCard(data) {

            news = data.articles.map((el, i) => {
                const card = newsCardTemplate.content.cloneNode(true).children[0];
                const img = card.querySelector('.news-card-img');
                const title = card.querySelector('.news-card-title');
                const author = card.querySelector('.news-card-author');
                const date = card.querySelector('.news-card-date');
                const desc = card.querySelector('.news-card-text');
                const link = card.querySelector('.news-url-link');
                const d = new Date(el.publishedAt)
                let convertDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} WIB`;
                //IMPLEMENTASI TEMPLATE
                img.setAttribute('src', el.urlToImage);
                link.setAttribute('href', el.url);
                title.textContent = el.title;
                author.textContent = el.author + " -";
                date.textContent = convertDate;
                desc.textContent = el.description;
                newsGroupCard.appendChild(card);
                return { title: el.title, templateElement: card };
            })

            //AMBIL DATA SESUAI LIVE INPUT SEARCH
            searchInput.addEventListener('input', e => {
                value = e.target.value.toLowerCase();
                urlEvery = `https://newsapi.org/v2/everything?q=${value}&apiKey=1ec087e86b5143d28480549839fbe11c`
                fetch(urlEvery)
                    .then(res => res.json())
                    .then(res => {
                        renderCard(res);
                    })
            })
        })
        // JIKA DATA TIDAK VALID
        .catch(() => {
            notFoundCard.classList.remove('hide');
            setTimeout(() => {
                notFoundCard.textContent = 'Data yang anda Cari tidak ditemukan!'
            }, 1000)
        })
        .finally(() => {
            alertCard.classList.add('hide');
        })
}

