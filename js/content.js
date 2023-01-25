function liveSearch(cb) {

    const notFoundCard = document.querySelector('.notFound-card');
    const searchInput = document.getElementById('searchInput');
    const alertCard = document.querySelector('.alert-card');
    let urlEvery ='';

    // Live search
    let value;
    let searchCard = [];

    searchInput.addEventListener('input', e => {
        value = e.target.value.toLowerCase();
        // urlEvery = `https://newsapi.org/v2/everything?q=${value}&apiKey=1ec087e86b5143d28480549839fbe11c`

        let isFound = [];
        searchCard.forEach(e => {
            let isMatch = e.title.toLowerCase().includes(value);
            isFound.push(isMatch);
            e.templateElement.classList.toggle('hide', !isMatch);
            !isFound.includes(true) ? notFoundCard.classList.remove('hide') : notFoundCard.classList.add('hide') // JIKA DATA TIDAK SESUAI
        })
        return value;
    })

    console.log(value);

    //AMBIL DATA SESUAI LIVE INPUT SEARCH
    // urlEvery = `https://newsapi.org/v2/everything?q=blitar&apiKey=1ec087e86b5143d28480549839fbe11c` //kurang ini doang, biar linknya bisa dinamis sesuai inputan user tuh gimanaaa
    fetch(urlEvery)
        .then(res => res.json())
        .then(res => {
            searchCard = cb(res);
        })
        .catch(() => {
            notFoundCard.classList.remove('hide');
            notFoundCard.textContent = 'Data yang anda Cari tidak ditemukan!'
        })
        .finally(() => {
            alertCard.classList.add('hide');
        })
    return searchCard;
}

// AMBIL DATA MELALUI API (HEADLINE)
function getData(cb) {

    const notFoundCard = document.querySelector('.notFound-card');
    const alertCard = document.querySelector('.alert-card');
    const urlHeadline = 'https://newsapi.org/v2/top-headlines?country=id&apiKey=1ec087e86b5143d28480549839fbe11c'
    let news = [];
    let temp;

    alertCard.classList.remove('hide'); // LOADING
    fetch(urlHeadline)
        .then(res => res.json())
        .then((data) => {
            temp = cb(data);
            news.push(temp)
        })
        // JIKA DATA TIDAK VALID
        .catch(() => {
            notFoundCard.classList.remove('hide');
            notFoundCard.textContent = 'Data yang anda Cari tidak ditemukan!'
        })
        .finally(() => {
            alertCard.classList.add('hide');
        })

    return news;
}

export function printNews() {
    const searchInput = document.getElementById('searchInput');
    const newsGroupCard = document.querySelector('.news-group-card');
    const newsCardTemplate = document.getElementById('news-card');
    const template = (data) => {
        let output;

        output = data.articles.map((el, i) => {
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

        return output;
    }

    // Menampilkan Headline
    // let printHeadline = getData(template);

    //menampilkan hasil pencarian
    liveSearch(template)
}

