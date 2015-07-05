var supertest = require('co-supertest');
var chai      = require('chai');
var Promise   = require('bluebird');
var _         = require('lodash');
var bcrypt    = require('bcrypt');
var app       = require('./../../../app');

describe('Users CRUD', function() {

  context('Users List', function() {

    var users = [];
    var usersCount = _.random(3, 10);

    before(function*() {
      users = yield require('../../fixtures/users')(usersCount);
    });

    before(function*() {
      response = (yield supertest(app.listen(app.config.port, app.config.host)).get('/users').end()).body
    });

    after(function*() {
      yield app.db.model('User').remove();
    });

    it('Reponse', function*() {
      chai.expect(response).to.be.an('object');
      chai.expect(response).to.have.property('success').with.to.be.a('boolean');
      chai.expect(response).to.have.property('result').with.to.be.an('array');
      chai.expect(response).to.have.property('status').with.to.be.an('number').with.equals(200);
    });

    it('Count', function*() {
      chai.expect(response).to.have.property('result').with.to.be.an('array').with.length(usersCount);
    });

    it('Email, FisrtName, LastName', function*() {
      var index = _.random(0, usersCount - 1);
      var userResponse = response.result[index];
      var user = _.find(users, {email: userResponse.email});
      chai.expect(user.email).to.be.equal(userResponse.email);
      chai.expect(user.fisrtName).to.be.equal(userResponse.fisrtName);
      chai.expect(user.lasrtName).to.be.equal(userResponse.lasrtName);
    });

    it('Password', function*() {
      var index = _.random(0, usersCount - 1);
      var userResponse = response.result[index];
      var user = _.find(users, {email: userResponse.email});
      chai.expect(userResponse).to.not.have.property('password');
      //chai.expect(user.email).to.be.equal(userResponse.email);
      //chai.expect(user.fisrtName).to.be.equal(userResponse.fisrtName);
      //chai.expect(user.lasrtName).to.be.equal(userResponse.lasrtName);
    })
  });

  //it('post object', function(done) {
  //  superagent.post('http://localhost:3000/collections/test')
  //    .send({
  //      name: 'John'
  //      , email: 'john@rpjs.co'
  //    })
  //    .end(function(e, res) {
  //      expect(e).to.eql(null)
  //      expect(res.body.length).to.eql(1)
  //      expect(res.body[0]._id.length).to.eql(24)
  //      id = res.body[0]._id
  //      done()
  //    })
  //});
  //
  //it('retrieves an object', function(done) {
  //  superagent.get('http://localhost:3000/collections/test/' + id)
  //    .end(function(e, res) {
  //      // console.log(res.body)
  //      expect(e).to.eql(null)
  //      expect(typeof res.body).to.eql('object')
  //      expect(res.body._id.length).to.eql(24)
  //      expect(res.body._id).to.eql(id)
  //      done()
  //    })
  //})
  //
  //it('retrieves a collection', function(done) {
  //  superagent.get('http://localhost:3000/collections/test')
  //    .end(function(e, res) {
  //      // console.log(res.body)
  //      expect(e).to.eql(null)
  //      expect(res.body.length).to.be.above(0)
  //      expect(res.body.map(function(item) {
  //        return item._id
  //      })).to.contain(id)
  //      done()
  //    })
  //})
  //
  //it('updates an object', function(done) {
  //  superagent.put('http://localhost:3000/collections/test/' + id)
  //    .send({
  //      name: 'Peter'
  //      , email: 'peter@yahoo.com'
  //    })
  //    .end(function(e, res) {
  //      // console.log(res.body)
  //      expect(e).to.eql(null)
  //      expect(typeof res.body).to.eql('object')
  //      expect(res.body.msg).to.eql('success')
  //      done()
  //    })
  //})
  //it('checks an updated object', function(done) {
  //  superagent.get('http://localhost:3000/collections/test/' + id)
  //    .end(function(e, res) {
  //      // console.log(res.body)
  //      expect(e).to.eql(null)
  //      expect(typeof res.body).to.eql('object')
  //      expect(res.body._id.length).to.eql(24)
  //      expect(res.body._id).to.eql(id)
  //      expect(res.body.name).to.eql('Peter')
  //      done()
  //    })
  //})
  //
  //it('removes an object', function(done) {
  //  superagent.del('http://localhost:3000/collections/test/' + id)
  //    .end(function(e, res) {
  //      // console.log(res.body)
  //      expect(e).to.eql(null)
  //      expect(typeof res.body).to.eql('object')
  //      expect(res.body.msg).to.eql('success')
  //      done()
  //    })
  //})
})
