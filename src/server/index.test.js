import request from 'supertest';
import server from './index';
import Courier from '../models/courierInterface';

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

  it('should return 200 when booking had already been created', async (done) => {
    const { id: courierId, max_capacity: maxCapacity } = validCourierParams;
    await Courier.create({ courierId, maxCapacity });
    await request(server)
      .post('/couriers')
      .send(validCourierParams)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });
});

describe('GET /couriers', () => {
  let bigCourier = {
    courierId: 'foo',
    maxCapacity: 5000,
  };
  let smallCourier = {
    courierId: 'bar',
    maxCapacity: 700,
  };

  beforeEach(async () => {
    await Courier.create(bigCourier);
    await Courier.create(smallCourier);
  });

  it('should return 200 with the list of couriers', async (done) => {
    const response = await request(server)
      .get('/couriers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body.map((courier) => courier.courierId)).toEqual([
      bigCourier.courierId,
      smallCourier.courierId,
    ]);
    done();
  });

  describe('Filter by available capacity', () => {
    it('should return the list of couriers with the required capacity available', async (done) => {
      const response = await request(server)
        .get('/couriers?capacity_required=1000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].courierId).toBe(bigCourier.courierId);
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

describe('PUT /couriers/:id/packages', () => {
  let courier;
  let courierData = {
    courierId: 'foo',
    maxCapacity: 5000,
  };
  let newPackageData = {
    id: 'bar',
    volume: 200,
  };

  beforeEach(async () => {
    courier = await Courier.create(courierData);
  });

  it('should return 201 when new package has been added', async (done) => {
    await request(server)
      .put('/couriers/foo/packages')
      .send({
        package: newPackageData,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
    done();
  });

  it('should return 200 when package is already at the courier', async (done) => {
    const { id: packageId, volume } = newPackageData;
    await Courier.addPackage({ courier, newPackage: { packageId, volume } });

    await request(server)
      .put('/couriers/foo/packages')
      .send({
        package: newPackageData,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });

  it('should return 422 when courier cannot carry the package', async (done) => {
    await request(server)
      .put('/couriers/foo/packages')
      .send({
        package: {
          ...newPackageData,
          volume: 6000,
        },
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
    done();
  });
});

describe('DELETE /couriers/:id/packages/:package_id', () => {
  beforeEach(async () => {
    const courier = await Courier.create({
      courierId: 'foo',
      maxCapacity: 5000,
    });

    await Courier.addPackage({
      courier,
      newPackage: {
        packageId: 'bar',
        volume: 1000,
      },
    });
  });

  it('should return 200 when package is removed from the courier', async (done) => {
    await request(server)
      .delete('/couriers/foo/packages/bar')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  });

  it('should return 404 when courier does not have the package', async (done) => {
    await request(server)
      .delete('/couriers/foo/packages/baz')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
    done();
  });
});
