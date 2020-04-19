import request from 'supertest';
import server from './index';

describe('Available endpoints', () => {
  it('should return 404 when endpoint does not exist', async (done) => {
    const res = await request(server).get('/foo');
    expect(res.statusCode).toEqual(404);
    done();
  });
});

describe('POST /couriers', () => {
  const validCourierParams = {
    id: 'foo',
    max_capacity: 2000,
  };

  it('should return 400 when request does not match Schema', async (done) => {
    await request(server)
      .post('/couriers')
      .send({
        id: 'foo',
        max_capacity: -1,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
    done();
  });

  it('should return 200 when booking has been created', async (done) => {
    await request(server)
      .post('/couriers')
      .send(validCourierParams)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });

  it('should return 500 when booking could not be created', async (done) => {
    await request(server)
      .post('/couriers')
      .send(validCourierParams)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500);
    done();
  });
});
