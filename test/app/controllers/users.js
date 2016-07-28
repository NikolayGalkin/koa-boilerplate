/* global describe, context, before, after, it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('lodash');
const app = require('./../../../app');
const fixtures = require('../../fixtures/users');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Users CRUD', () => {
  context('Users List', () => {
    const usersCount = Math.floor(Math.random() * 8) + 3; // 3 <= usersCount <= 10;
    const request = chai.request(app.listen(process.env.APP_PORT, process.env.APP_HOST));
    let users = [];

    before(next => {
      app.db.model('User').remove().then(() => {
        fixtures(usersCount, (err, result) => {
          if (err) {
            return next(err);
          }
          users = result;
          return next();
        });
      });
    });

    it('Response', next => {
      request
        .get('/users')
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('success').with.to.be.a('boolean');
          expect(res.body).to.have.property('result').with.to.be.an('array');
          expect(res.body).to.have.property('status').with.to.be.an('number').with.equals(200);
          next();
        });
    });

    it('Count', next => {
      request
        .get('/users')
        .end((err, res) => {
          expect(res.body).to.have.property('result').with.to.be.an('array').with.length(usersCount);
          next();
        });
    });

    it('Email, FisrtName, LastName', next => {
      request
        .get('/users')
        .end((err, res) => {
          const index = _.random(0, usersCount - 1);
          const userResponse = res.body.result[index];
          const user = _.find(users, { email: userResponse.email });
          expect(user.email).to.be.equal(userResponse.email);
          expect(user.fisrtName).to.be.equal(userResponse.fisrtName);
          expect(user.lasrtName).to.be.equal(userResponse.lasrtName);
          next();
        });
    });

    it('Password', next => {
      request
        .get('/users')
        .end((err, res) => {
          // const index = _.random(0, usersCount - 1);
          // const userResponse = res.body.result[index];
          // const user = _.find(users, { email: userResponse.email });
          // chai.expect(userResponse).to.not.have.property('password');
          // chai.expect(user.email).to.be.equal(userResponse.email);
          // chai.expect(user.fisrtName).to.be.equal(userResponse.fisrtName);
          // chai.expect(user.lasrtName).to.be.equal(userResponse.lasrtName);
          next();
        });
    });
  });
});
