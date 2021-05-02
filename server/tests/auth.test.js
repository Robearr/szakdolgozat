const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const { expect } = require('chai');
const { describe, it } = require('mocha');

chai.use(chaiHttp);

describe('POST /auth/login', () => {
  describe('not existing user', () => {
    it('should fail', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          name: 'nobody'
        })
        .end((_, res) => {
          expect(res.body.severity).to.equal('ERROR');
          expect(res.body.messages).to.include('Nincs ilyen felhasználó!');
          done();
        });
    });
  });

  describe('wrong password', () => {
    it('should fail', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          name: 'test',
          password: 'test'
        })
        .end((_, res) => {
          expect(res.body.severity).to.equal('ERROR');
          expect(res.body.messages).to.include('Nem megfelelő a jelszó!');
          done();
        });
    });
  });

  describe('successful login', () => {
    it('should return the JWT', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          name: 'test',
          password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
        })
        .end((_, res) => {
          console.log(res.body);
          expect(res.body).to.contain.keys(['token', 'isTeacher']);
          expect(res.body.token).to.be.a('string');
          expect(res.body.isTeacher).to.be.a('boolean');
          done();
        });
    });
  });

});