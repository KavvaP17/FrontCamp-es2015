const config = {
    apiKey: '5682c3e724464abcbc6f267ef4ec3389',
    url: 'https://newsapi.org/v2/everything?',
    channels : [
        {
            label: 'ABC NEWS',
            value: 'abc-news'
        },
        {
            label: 'BBC NEWS',
            value: 'bbc-news'
        },
        {
            label: 'BBC SPORT',
            value: 'bbc-sport'
        },
        {
            label: 'FOX NEWS',
            value: 'fox-news'
        },
        {
            label: 'FOX SPORTS',
            value: 'fox-sports'
        },
        {
            label: 'GOOGLE NEWS',
            value: 'google-news'
        },
    ],
    recordsCount : [
        {
            label: '1',
            value: 1
        },
        {
            label: '5',
            value: 5
        },
        {
            label: '10',
            value: 10
        },
        {
            label: '15',
            value: 15
        },
        {
            label: '20',
            value: 20
        },
        {
            label: '50',
            value: 50
        },
    ] 
}

class NewsApi {
    constructor(apiKey, url) {
        this.apiKey = apiKey;
        this.url = url;
    }

    getUrl(channel, recordCount) {
        return `${this.url}sources=${channel}&pageSize=${recordCount}&apiKey=${this.apiKey}`;
    }

    getData(channel, recordCount) {
        const url = this.getUrl(channel, recordCount);
        return fetch(url)
            .then(response => response.json())
            .then(result => result.articles);
    }
}

class Articles {
    constructor(){}

    parseDataToHtmlFragment(data) {
        const fragment = document.createDocumentFragment();
        const ul = document.createElement('ul');
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = this.getArticleTemplate(item);
            ul.appendChild(li);
        });
        fragment.appendChild(ul);
        return fragment;
    }

    getArticleTemplate(article){
        const options = {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };

        return `
            <div class="img-container">
                <a class="img-wrapper" href="${article.url}">
                    <img class="article-img" src="${article.urlToImage}" />
                    <p class="description">${article.description}</p>
                </a>
            </div>
            <div class="article-content-container">
                <h3 class="article-title">
                    <a href="${article.url}">${article.title}</a>
                </h3>
                <p class="article-published">${article.author} - ${article.publishedAt.toLocaleString('en-US', options)}</p>
            </div>
        `;
    }
}

class Main {
    constructor(config) {
        this.selectedChanelIndex = 0;
        this.selectedRecordCountIndex = 0;

        this.channels = config.channels;
        this.recordsCount = config.recordsCount;

        this.searchBtn = document.querySelector('#search-btn');
        this.chanelsSelect = document.querySelector('#chanels-select');
        this.recordsSelect = document.querySelector('#records-count-select');
        this.resultConteiner = document.querySelector('#search-result');

        const {apiKey, url} = config;
        this.api = new NewsApi(apiKey, url);
        this.articles = new Articles();
    }

    init() {
        this.renderSelect(this.chanelsSelect, this.channels);
        this.renderSelect(this.recordsSelect, this.recordsCount);

        this.searchBtn.addEventListener('click', this.search.bind(this));
        this.chanelsSelect.addEventListener('change', this.updateChanel.bind(this));
        this.recordsSelect.addEventListener('change', this.updateRecordsCount.bind(this));
    }

    renderSelect(target, data) {
        const fragment = document.createDocumentFragment();
        data.forEach(item => {
            const option = document.createElement('option');
            option.setAttribute('value', item.value);
            option.appendChild(document.createTextNode(item.label));
            fragment.appendChild(option);
        });
        target.appendChild(fragment);
    }

    search() {
        const channel = this.channels[this.selectedChanelIndex].value;
        const recordsCount = this.recordsCount[this.selectedRecordCountIndex].value;
        this.api.getData(channel,recordsCount)
            .then(jsonData => {
                const fragment = this.articles.parseDataToHtmlFragment(jsonData);
                this.resultConteiner.innerHTML = "";
                this.resultConteiner.appendChild(fragment);
            })
            .catch(error => console.log(error.message));
    }

    updateChanel(event) {
        this.selectedChanelIndex = event.target.selectedIndex;
    }

    updateRecordsCount(event) {
        this.selectedRecordCountIndex = event.target.selectedIndex;  
    }
}

// app
const app = new Main(config);
app.init();
