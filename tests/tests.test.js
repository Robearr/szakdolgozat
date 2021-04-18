const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const { expect } = require('chai');
const { describe, it } = require('mocha');


chai.use(chaiHttp);

describe('GET /tests', () => {
  it('should return every test', (done) => {
    chai.request(server)
      .get('/tests')
      .end((_, res) => {
        expect(res.body).to.be.a('array');
        expect(res.body.length).not.to.be.eq(0);
        done();
      });
  });
});

describe('GET /tests//0', () => {
  it('should return the first package', (done) => {
    chai.request(server)
      .get('/tests/0')
      .end((_, res) => {
        expect(res.body).to.deep.equal({
          name: 'Négyzet számolása',
          timeout: 10000,
          customErrorMessage: 'Nem jók a négyzetszámok!',
          isCustomErrorMessageVisible: true,
          isErrorDescriptionVisible: true,
          isStackVisible: true,
          points: 3,
          packageId: 1,
          callbackPath: 'tests/squareCalculatorCheck.js'
        });
        done();
      });
  });
});

describe('POST /tests', () => {

  it('should fail, because the user is not logged in', (done) => {
    chai.request(server)
      .post('/tests')
      .send({})
      .end((_, res) => {
        expect(res.body.severity).to.equal('ERROR');
        done();
      });
  });

  it('should fail, because the user is not a teacher', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'test',
        password: 'user'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            done();
          });
      });
  });

  it('should fail, because no name is provided', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A teszt nevének megadása kötelező!');
            done();
          });
      });
  });

  it('should fail, because timeout is not provided', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A timeout megadása kötelező!');
            done();
          });
      });
  });

  it('should fail, because timeout is not a number', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            timeout: 'szöveg'
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A timeout csak szám lehet!');
            done();
          });
      });
  });

  it('should fail, because timeout is not greater than 0', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            timeout: -12
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A timeoutnak nagyobbnak kell lennie nullánál!');
            done();
          });
      });
  });

  it('should fail, because points is not provided', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A pontszám megadása kötelező!');
            done();
          });
      });
  });

  it('should fail, because points is not a number', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            points: 'szöveg'
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A pontszám csak szám lehet!');
            done();
          });
      });
  });

  it('should fail, because points is not greater than 0', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            points: -12
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A pontszámnak nagyobbnak kell lennie nullánál!');
            done();
          });
      });
  });

  it('should fail, because packageId is not provided', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A packageId megadása kötelező!');
            done();
          });
      });
  });

  it('should fail, because packageId does not exist', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            packageId: 10
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('Nem létezik a csomag!');
            done();
          });
      });
  });

  it('should fail, because callbackPath is not provided', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A callbackPath megadása kötelező!');
            done();
          });
      });
  });

  it('should fail, because callbackPath is not provided', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            callbackPath: 42
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A callbackPath csak string lehet!');
            done();
          });
      });
  });

  it('should create a new test', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Test test',
            timeout: 10000,
            customErrorMessage: 'Custom error message!',
            isCustomErrorMessageVisible: true,
            isErrorDescriptionVisible: true,
            isStackVisible: true,
            points: 3,
            packageId: 0,
            callbackPath: 'tests/test'
          })
          .end((_, res) => {
            const testNames = res.body.map((pckg) => pckg.tests).flat().map((test) => test.name);
            expect(testNames).to.include('Test test');
            done();
          });
      });
  });

  it('should fail, because the name exists', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/tests')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Test test'
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A megadott tesztnév már létezik!');
            done();
          });
      });
  });
});

describe('PUT /tests/2', () => {
  it('should fail, because the user is not logged in', (done) => {
    chai.request(server)
      .put('/tests/2')
      .send({})
      .end((_, res) => {
        expect(res.body.severity).to.equal('ERROR');
        done();
      });
  });

  it('should fail, because the user is not a teacher', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'test',
        password: 'user'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .put('/tests/2')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            done();
          });
      });
  });

  it('should modify the third test', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .put('/tests/2')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Modified test'
          })
          .end((_, res) => {
            expect(res.body.name).to.equal('Modified test');
            done();
          });
      });
  });
});

describe('DELETE /tests/2', () => {
  it('should return a JWT error message', (done) => {
    chai.request(server)
      .delete('/tests/2')
      .end((_, res) => {
        expect(res.body.severity).to.equal('ERROR');
        done();
      });
  });

  it('should return an auth error message', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'test',
        password: 'user'
      })
      .end((_, res) => {
        const token = res.body.token;

        chai.request(server)
          .delete('/tests/2')
          .set('Authorization', `Bearer ${token}`)
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            done();
          });
      });
  });

  it('should delete the third test', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;

        chai.request(server)
          .delete('/tests/2')
          .set('Authorization', `Bearer ${token}`)
          .end((_, res) => {
            expect(res.body[0].tests).to.have.lengthOf(2);
            done();
          });
      });
  });
});
