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
        this.loader = document.querySelector('#loader');

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
        this.switchLoader();

        const channel = this.channels[this.selectedChanelIndex].value;
        const recordsCount = this.recordsCount[this.selectedRecordCountIndex].value;
        this.api.getData(channel,recordsCount)
            .then(jsonData => {
                const fragment = this.articles.parseDataToHtmlFragment(jsonData);
                this.resultConteiner.innerHTML = "";
                this.resultConteiner.appendChild(fragment);
                this.switchLoader();
            })
            .catch(error => console.log(error.message));
    }

    switchLoader() {
        this.loader.classList.toggle('hidden');
        this.resultConteiner.classList.toggle('hidden');
    }

    updateChanel(event) {
        this.selectedChanelIndex = event.target.selectedIndex;
    }

    updateRecordsCount(event) {
        this.selectedRecordCountIndex = event.target.selectedIndex;  
    }
}