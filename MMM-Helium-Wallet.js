/* global Module */

/* Magic Mirror
 * Module: MMM-Helium
 *
 * By Clinton Thomas
 * MIT Licensed.
 */

Module.register('MMM-Helium-Wallet', {
  defaults: {
    updateInterval: 3600000,
    retryDelay: 5000,
    api: 'https://api.helium.io/v1/accounts/',
    address: config.address,
    user_agent: 'Magic Mirror Module - Helium Wallet Balance Display',
    priceAPI:
      'https://api.coingecko.com/api/v3/simple/price?ids=helium&vs_currencies=',
  },

  requiresVersion: '2.1.0', // Required version of MagicMirror

  start: function () {
    var self = this;
    let hnt = 0;
    let value = 0;
    let total;
    const url = this.config.api + this.config.address;
    this.loaded = false;
    const curr = this.config.currency;
    const priceurl = this.config.priceAPI + curr;
    this.getValue(priceurl);
    setInterval(function () {
      self.getValue(priceurl);
      self.updateDom();
    }, this.config.updateInterval);
  },
  getBalance: function (url) {
    const self = this;
    fetch(url, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this.user_agent,
    })
      .then(response => {
        const a = response.json();
        return a;
      })
      .then(a => a.data)
      .then(data => {
        const balance = data.balance;
        return balance;
      })
      .then(hnt => {
        const bal = (hnt / 100000000).toFixed(2);
        this.hnt = bal;
        this.sendSocketNotification('BAL', bal);
        return bal;
      })
      .then(bal => {
        const a = bal * this.value;
        const b = a.toFixed(2);
        this.injectHTML(bal, b);
      });
  },
  getValue: function (url) {
    const self = this;
    fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': this.user_agent,
      },
    })
      .then(response => response.json())
      .then(json => json.helium)
      .then(helium => {
        const self = this;
        const curr = this.config.currency;
        this.value = helium[curr];
        return helium[curr];
      })
      .then(() => {
        this.getBalance(this.config.api + this.config.address);
      });
  },
  injectHTML: function (balance, value) {
    var self = this;
    const val = document.querySelector('.showValue');
    const bal = document.querySelector('.showBalance');
    const curr = this.config.currency;
    const symbol = currencySymbols[curr];
    if (bal) {
      val.innerHTML = 'Value: ' + symbol + value;
      bal.innerHTML = 'HNT: ' + balance;
    }
  },
  scheduleUpdate: function (delay) {
    let nextLoad = this.config.updateInterval;
    if (typeof delay !== 'undefined' && delay >= 0) {
      nextLoad = delay;
    }
    nextLoad = nextLoad;
    let self = this;
    setTimeout(function () {
      const curr = this.config.currency;
      const priceurl = this.config.priceAPI + curr;
      self.getValue(priceurl);
    }, nextLoad);
  },

  getDom: function () {
    const self = this;
    const wrapper = document.createElement('div');
    const balanceDiv = document.querySelector('.showBalance');
    wrapper.classList.add('helium-wrapper');

    const showBalance = document.createElement('span');
    showBalance.classList.add('showBalance');
    const showValue = document.createElement('span');
    showValue.classList.add('showValue');

    wrapper.appendChild(showBalance);
    wrapper.appendChild(showValue);

    this.sendSocketNotification('DOM_OBJECTS_CREATED');

    return wrapper;
  },

  getScripts: function () {
    return ['currencies.js', 'currency-symbol.js'];
  },

  getStyles: function () {
    return ['MMM-Helium-Wallet.css'];
  },

  getTranslations: function () {
    return {
      //en: 'translations/en.json',
    //  es: 'translations/es.json',
    };
  },
});
