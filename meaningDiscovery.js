var Promise = require('bluebird');
var meaningOfLife = require('./meaningOfLife');

module.exports = {
    meaningOfLife: meaningOfLife.meaning,
    discover: function(x) {
        x = x || 0;
        if(x == module.exports.meaningOfLife()) {
            return Promise.resolve(x);
        }
        else {
            if(x > 100) {
                return Promise.resolve(module.exports.meaningOfLife());
            }
            return Promise.delay(25).then(function() {
                return module.exports.discover(x+1);
            });
        }
    }
};