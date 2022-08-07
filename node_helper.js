var NodeHelper = require('node_helper');
module.exports = NodeHelper.create({
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'DOM_OBJECTS_CREATED') {
      let balance;
      let usd;
      let total;
      if (notification === 'BAL') {
        this.balance = payload;
      }
      if (notification === 'VAL') {
        this.usd = payload;
      }
      if (this.balance && this.usd) {
        this.total = (balance * usd).toFixed(2);
        this.sendSocketNotification('TOTAL', total);
      }
    }
  },
});
