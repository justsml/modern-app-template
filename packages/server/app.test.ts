import supertest from 'supertest';
import app from './app';

describe('Should respond with 200 on healthcheck /ping', function() {
  it('responds with json', function(done) {
    supertest(app)
      .get('/ping')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
