var Monky     = require('monky');
var faker     = require('faker');
var Promise   = require('bluebird');
var app       = require('../../app');
var monky     = new Monky(app.db);
var create    = Promise.promisify(monky.create, monky);
var result    = [];

monky.factory('User', {
  email:     faker.internet.email(),
  password:  faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName:  faker.name.lastName()
});

module.exports = function*(num) {
  for (var i = 0; i < num; i++) {
    result.push(yield create('User', {
      email:     faker.internet.email(),
      password:  faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName:  faker.name.lastName()
    }))
  }
  return result
};
