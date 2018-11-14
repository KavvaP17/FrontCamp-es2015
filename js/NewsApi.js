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