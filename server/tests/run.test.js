const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const { expect } = require('chai');
const { describe, it } = require('mocha');

chai.use(chaiHttp);

describe('POST /tests/:id/run', () => {
  describe('the test is not completed', () => {
    it('should return 0 points', (done) => {
      chai.request(server)
        .post('/tests/0/run')
        .send({
          url: process.env.TEST_CLIENT_URL
        })
        .end((_, res) => {
          expect(res.body[0].points).to.equal(0);
          done();
        });
    });
  });

  describe('the test is not correct', () => {
    it('should return 0 points', (done) => {
      chai.request(server)
        .post('/tests/1/run')
        .send({
          url: process.env.TEST_CLIENT_URL
        })
        .end((_, res) => {
          expect(res.body[0].points).to.equal(0);
          done();
        });
    });
  });

  describe('the test is correct', () => {
    it('should return 5 points', (done) => {
      chai.request(server)
        .post('/tests/2/run')
        .send({
          url: process.env.TEST_CLIENT_URL
        })
        .end((_, res) => {
          expect(res.body[0].points).to.equal(5);
          done();
        });
    });
  });
});

describe('POST /packages/:id/run', () => {
  describe('the package does not exists', () => {
    it('should return an error', (done) => {
      chai.request(server)
        .post('/packages/99/run')
        .send({
          url: process.env.TEST_CLIENT_URL
        })
        .end((_, res) => {
          expect(res.body.severity).to.equal('ERROR');
          done();
        });
    });
  });

  describe('the package is not activated', () => {
    it('should return an error', (done) => {
      chai.request(server)
        .post('/packages/1/run')
        .send({
          url: process.env.TEST_CLIENT_URL
        })
        .end((_, res) => {
          expect(res.body.severity).to.equal('ERROR');
          done();
        });
    });
  });

  describe('the package is not available', () => {
    it('should return an error', (done) => {
      chai.request(server)
        .post('/packages/2/run')
        .send({
          url: process.env.TEST_CLIENT_URL
        })
        .end((_, res) => {
          expect(res.body.severity).to.equal('ERROR');
          done();
        });
    });
  });

  describe('the package needs auth', () => {
    describe('the user is not logged in', () => {
      it('should return an error', (done) => {
        chai.request(server)
          .post('/packages/3/run')
          .send({
            url: process.env.TEST_CLIENT_URL
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            done();
          });
      });
    });

    describe('a user is logged in', () => {
      it('should return an error', (done) => {
        chai.request(server)
          .post('/auth/login')
          .send({
            name: 'test',
            password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
          })
          .end((_, res) => {
            const token = res.body.token;

            chai.request(server)
              .post('/packages/3/run')
              .set('Authorization', `Bearer ${token}`)
              .send({
                url: process.env.TEST_CLIENT_URL
              })
              .end((_, res) => {
                expect(res.body.severity).to.equal('ERROR');
                done();
              });
          });
      });
    });
  });

  describe('the package runs perfectly', () => {
    it('should return the results for each test', (done) => {
      chai.request(server)
        .post('/packages/0/run')
        .send({
          url: process.env.TEST_CLIENT_URL
        })
        .end((_, res) => {
          const points = res.body.map((result) => result.points);

          expect(points).to.deep.equal([0, 0, 5]);
          done();
        });
    });
  });

  describe('the package runs perfectly for the given tests', () => {
    it('should return the results for each test', (done) => {
      chai.request(server)
        .post('/packages/0/run')
        .send({
          url: process.env.TEST_CLIENT_URL,
          tests: [0, 2]
        })
        .end((_, res) => {
          const points = res.body.map((result) => result.points);

          expect(points).to.deep.equal([0, 5]);
          done();
        });
    });
  });

});