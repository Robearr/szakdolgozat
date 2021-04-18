const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const { expect } = require('chai');
const { describe, it } = require('mocha');

chai.use(chaiHttp);

describe('GET /packages', () => {
  it('should return every package', (done) => {
    chai.request(server)
      .get('/packages')
      .end((_, res) => {
        expect(res.body).to.be.a('array');
        expect(res.body.length).not.to.be.eq(0);
        done();
      });
  });
});

describe('GET /packages//0', () => {
  it('should return the first package', (done) => {
    chai.request(server)
      .get('/packages/0')
      .end((_, res) => {
        const result = res.body;
        delete result.tests;

        expect(result).to.deep.equal({
          name: 'Szimpla tesztcsomag',
          description: 'Egy egyszerű tesztcsomag, ami pár alap tesztet tartalmaz magában, hogy a normális működést le tudjam ellenőrizni.',
          isActive: true,
          availableFrom: '2021-01-01',
          availableTo: '2021-12-12',
          needsAuth: false,
          ipMask: '',
          urlMask: '',
          timeout: 10000
        });
        done();
      });
  });
});

describe('(de)activation endpoints', () => {

  describe('GET /packages/0/deactivate', () => {
    it('should return a JWT error message', (done) => {
      chai.request(server)
        .get('/packages/0/deactivate')
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
            .get('/packages/0/deactivate')
            .set('Authorization', `Bearer ${token}`)
            .end((_, res) => {
              expect(res.body.severity).to.equal('ERROR');
              done();
            });
        });
    });

    it('should deactivate the package', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          name: 'admin',
          password: 'admin'
        })
        .end((_, res) => {
          const token = res.body.token;

          chai.request(server)
            .get('/packages/0/deactivate')
            .set('Authorization', `Bearer ${token}`)
            .end((_, res) => {
              expect(res.body.isActive).to.be.false;
              done();
            });
        });
    });
  });

  describe('GET /packages/0/activate', () => {
    it('should return a JWT error message', (done) => {
      chai.request(server)
        .get('/packages/0/activate')
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
            .get('/packages/0/activate')
            .set('Authorization', `Bearer ${token}`)
            .end((_, res) => {
              expect(res.body.severity).to.equal('ERROR');
              done();
            });
        });
    });

    it('should activate the package', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          name: 'admin',
          password: 'admin'
        })
        .end((_, res) => {
          const token = res.body.token;

          chai.request(server)
            .get('/packages/0/activate')
            .set('Authorization', `Bearer ${token}`)
            .end((_, res) => {
              expect(res.body.isActive).to.be.true;
              done();
            });
        });
    });
  });

});

describe('Package\'s tests', () => {
  describe('GET /packages/0/tests', () => {
    it('should return every test of the package', (done) => {
      chai.request(server)
        .get('/packages/0/tests')
        .end((_, res) => {
          expect(res.body).to.deep.equal([
            {
              name: 'Négyzet számolása',
              timeout: 10000,
              customErrorMessage: 'Nem jók a négyzetszámok!',
              isCustomErrorMessageVisible: true,
              isErrorDescriptionVisible: true,
              isStackVisible: true,
              points: 3,
              packageId: 1,
              callbackPath: 'tests/squareCalculatorCheck.js'
            },
            {
              name: 'Páros számok',
              timeout: 10000,
              customErrorMessage: 'Nem párosak a számok!',
              isCustomErrorMessageVisible: true,
              isErrorDescriptionVisible: false,
              isStackVisible: false,
              points: 3,
              packageId: 1,
              callbackPath: 'tests/evenNumbersChecker.js'
            }
          ]);
          done();
        });
    });
  });

  describe('GET /packages/0/tests/1', () => {
    it('should return the second test of the package', (done) => {
      chai.request(server)
        .get('/packages/0/tests/1')
        .end((_, res) => {
          expect(res.body).to.deep.equal({
            name: 'Páros számok',
            timeout: 10000,
            customErrorMessage: 'Nem párosak a számok!',
            isCustomErrorMessageVisible: true,
            isErrorDescriptionVisible: false,
            isStackVisible: false,
            points: 3,
            packageId: 1,
            callbackPath: 'tests/evenNumbersChecker.js'
          });
          done();
        });
    });
  });
});

describe('POST /packages', () => {

  it('should fail, because the user is not logged in', (done) => {
    chai.request(server)
      .post('/packages')
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
          .post('/packages')
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
          .post('/packages')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A tesztcsomag nevének megadása kötelező!');
            done();
          });
      });
  });

  it('should fail, because the availableFrom field is after the availableTo field', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/packages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            availableFrom: '2022-01-01',
            availableTo: '2020-01-01'
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('Az availableFrom csak az availableTo előtt lehet!');
            done();
          });
      });
  });

  it('should fail, because isActive is not a boolean', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/packages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            isActive: 'igen'
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('Az isActive csak a következő értékeket veheti fel: 0, 1, true, false');
            done();
          });
      });
  });

  it('should fail, because needsAuth is not a boolean', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/packages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            needsAuth: 'nem'
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A needsAuth csak a következő értékeket veheti fel: 0, 1, true, false');
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
          .post('/packages')
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
          .post('/packages')
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
          .post('/packages')
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

  it('should create a new package', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .post('/packages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Test package',
            description: 'Description',
            isActive: 1,
            availableFrom: '2021-01-01',
            availableTo: '2021-12-12',
            needsAuth: 0,
            ipMask: '',
            urlMask: '',
            timeout: 10000
          })
          .end((_, res) => {
            const packageNames = res.body.map((pckg) => pckg.name);
            expect(packageNames).to.include('Test package');
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
          .post('/packages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Test package'
          })
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            expect(res.body.messages).to.include('A megadott csomagnév már létezik!');
            done();
          });
      });
  });
});

describe('PUT /packages/2', () => {
  it('should fail, because the user is not logged in', (done) => {
    chai.request(server)
      .put('/packages/2')
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
          .put('/packages/2')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            done();
          });
      });
  });

  it('should modify the third package', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;
        chai.request(server)
          .put('/packages/2')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Modified test package'
          })
          .end((_, res) => {
            expect(res.body.name).to.equal('Modified test package');
            done();
          });
      });
  });

});

describe('DELETE /packages/0', () => {
  it('should return a JWT error message', (done) => {
    chai.request(server)
      .delete('/packages/0')
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
          .delete('/packages/0')
          .set('Authorization', `Bearer ${token}`)
          .end((_, res) => {
            expect(res.body.severity).to.equal('ERROR');
            done();
          });
      });
  });

  it('should delete the third package', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin'
      })
      .end((_, res) => {
        const token = res.body.token;

        chai.request(server)
          .delete('/packages/2')
          .set('Authorization', `Bearer ${token}`)
          .end((_, res) => {
            expect(res.body).to.have.lengthOf(2);
            done();
          });
      });
  });
});
