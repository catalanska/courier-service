import Courier from './Courier';

const validCourierParams = {
  courierId: 'foo',
  maxCapacity: 2000,
};

const expectCourierObject = () => {
  const { courierId, maxCapacity } = validCourierParams;

  return expect.objectContaining({
    __v: expect.any(Number),
    _id: expect.anything(),
    courierId: courierId,
    maxCapacity: maxCapacity,
    currentCapacity: maxCapacity,
  });
};

describe('New Courier', () => {
  describe('Valid params', () => {
    it('create & save courier successfully', async (done) => {
      const courier = new Courier(validCourierParams);

      const savedCourier = await courier.save();

      expect(savedCourier).toEqual(expectCourierObject());
      done();
    });
  });

  describe('Invalid params', () => {
    it('courier cannot be created', async (done) => {
      const courier = new Courier({
        courierId: 'foo',
      });

      let err;
      try {
        await courier.save();
      } catch (error) {
        err = error;
      }
      expect(err.errors.maxCapacity).toBeDefined();
      done();
    });
  });
});

describe('Find Couriers', () => {
  beforeEach(async () => {
    await Courier.create(validCourierParams);
  });

  describe('Without filters', () => {
    it('returns all existing couriers', async (done) => {
      const couriers = await Courier.find();

      expect(couriers).toEqual(expect.arrayContaining([expectCourierObject()]));
      done();
    });
  });

  describe('With currentCapacity filter', () => {
    it('returns courier if has the requested capacity', async (done) => {
      const couriers = await Courier.find().where('currentCapacity').gte(1000);

      expect(couriers).toEqual(expect.arrayContaining([expectCourierObject()]));
      done();
    });

    it('returns an empty list if no courier has the requested capacity', async (done) => {
      const couriers = await Courier.find().where('currentCapacity').gte(5000);

      expect(couriers).toEqual(expect.arrayContaining([]));
      done();
    });
  });
});
