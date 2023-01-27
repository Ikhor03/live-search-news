// AMBIL DATA MELALUI API 
function getData(url, cb) {

    const notFoundCard = document.querySelector('.notFound-card');
    const alertCard = document.querySelector('.alert-card');

    let news = [];
    let temp;
    alertCard.classList.remove('hide'); // LOADING
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            temp = cb(data);
            news.push(temp)
        })
        // JIKA DATA TIDAK VALID
        .catch(() => {
            if (url === 'hide') {
                notFoundCard.classList.add('hide');
            } else {
                notFoundCard.classList.remove('hide');
            }
            notFoundCard.textContent = 'Data yang anda Cari tidak ditemukan!'
        })
        .finally(() => {
            alertCard.classList.add('hide');
        })
    return news;
}

// COBA FUNCTION INI DI RETURN, TERUS HASIL RETURNNYA BERUPA urlLink YANG TERUS DIJADIKAN PARAMETER UNTUK loadData;
let flag = true;
function searchUrl(value) {

    if (value.length > 0) {
        flag = false;
        return `https://newsapi.org/v2/everything?q=${value}&apiKey=1ec087e86b5143d28480549839fbe11c`;
    } else {
        flag = true;
        return 'https://newsapi.org/v2/top-headlines?country=id&apiKey=1ec087e86b5143d28480549839fbe11c'
    }

}



function liveSearch(cb) {

    const notFoundCard = document.querySelector('.notFound-card');
    const searchInput = document.getElementById('searchInput');
    let urlHeadline = 'https://newsapi.org/v2/top-headlines?country=id&apiKey=1ec087e86b5143d28480549839fbe11c'
    let data = getData(urlHeadline, cb);

    // NOTE : Function "searchUrl" untuk handle value input search belum ketemu
    // searchInput.addEventListener('input', e => {
    //    getData(searchUrl(e.target.value.toLowerCase()), cb) ;
    // })

    // Live search
    let value;

    searchInput.addEventListener('input', e => {
        value = e.target.value.toLowerCase();
        let isFound = [];
        data[0].forEach(e => {
            let isMatch = e.title.toLowerCase().includes(value);
            isFound.push(isMatch);
            e.templateElement.classList.toggle('hide', !isMatch);
            !isFound.includes(true) ? notFoundCard.classList.remove('hide') : notFoundCard.classList.add('hide') // JIKA DATA TIDAK SESUAI
        })
    })
}

export function printNews() {
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

    liveSearch(template)
}

