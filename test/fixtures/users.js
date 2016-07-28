const Monky = require('monky');
const app = require('../../app');

const monky = new Monky(app.db);

monky.factory('User', {
  email: 'email#n@email.com',
  password: 'password#n',
  firstName: 'FisrtName#n',
  lastName: 'LastName#n'
});

module.exports = (num, done) => {
  monky.createList('User', num, done);
};
