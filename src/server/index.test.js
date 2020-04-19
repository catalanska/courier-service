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

  it('should return 201 when booking has been created', async (done) => {
    await request(server)
      .post('/couriers')
      .send(validCourierParams)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
    done();
  });
});

describe('GET /couriers', () => {
  it('should return 200 with the list of couriers', async (done) => {
    await request(server)
      .get('/couriers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });

  describe('Filter by available capacity', () => {
    it('should return the list of couriers with the required capacity available', async (done) => {
      const response = await request(server)
        .get('/couriers?capacity_required=1000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      done();
    });

    it('should return an empty list of couriers when none have the required capacity available', async (done) => {
      const response = await request(server)
        .get('/couriers?capacity_required=20000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.length).toBe(0);
      done();
    });
  });
});

describe('PUT /couriers/:id/package', () => {
  it('should return 201 when new package has been added', async (done) => {
    await request(server)
      .put('/couriers/foo/pacakge')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
    done();
  });

  it('should return 200 when package is already at the courier', async (done) => {
    await request(server)
      .put('/couriers/foo/pacakge')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });

  it('should return 422 when courier cannot carry the package', async (done) => {
    await request(server)
      .get('/couriers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
    done();
  });
});

describe('DELETE /couriers/:id/package/:package_id', () => {
  it('should return 200 when package is removed from the courier', async (done) => {
    await request(server)
      .delete('/couriers/foo/package/bar')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });

  it('should return 404 when courier does not have the package', async (done) => {
    await request(server)
      .delete('/couriers/foo/package/baz')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
    done();
  });
});
