import Courier from './courierInterface';

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
    currentCapacity: expect.any(Number),
    packages: expect.any(Array),
  });
};

describe('New Courier', () => {
  describe('Valid params', () => {
    it('create & save courier successfully', async (done) => {
      const savedCourier = await Courier.create(validCourierParams);

      expect(savedCourier).toEqual(expectCourierObject());
      done();
    });
  });

  describe('Invalid params', () => {
    it('courier cannot be created', async (done) => {
      const invalidCourierParams = {
        courierId: 'foo',
      };

      let err;
      try {
        await Courier.create(invalidCourierParams);
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
      const couriers = await Courier.find({ capacity: 1000 });

      expect(couriers).toEqual(expect.arrayContaining([expectCourierObject()]));
      done();
    });

    it('returns an empty list if no courier has the requested capacity', async (done) => {
      const couriers = await Courier.find({ capacity: 5000 });

      expect(couriers).toEqual(expect.arrayContaining([]));
      done();
    });
  });
});

describe('Add package to a courier', () => {
  let courier;

  beforeEach(async () => {
    courier = await Courier.create(validCourierParams);
  });

  it('stores the new package to the packages list', async (done) => {
    const { courierId, currentCapacity } = courier;
    const newPackage = {
      packageId: 'bar',
      volume: 100,
    };

    const updatedCourier = await Courier.addPackage({ courierId, newPackage });

    expect(updatedCourier).toEqual(expectCourierObject());
    expect(updatedCourier.currentCapacity).toEqual(currentCapacity - 100);
    expect(updatedCourier.packages).toEqual(expect.arrayContaining([newPackage]));

    done();
  });

  it('throws an Error if the courier cannot carry the new package', async (done) => {
    const { courierId } = courier;
    const newPackage = {
      packageId: 'bar',
      volume: 500000,
    };

    await expect(Courier.addPackage({ courierId, newPackage })).rejects.toThrow();

    done();
  });
});

describe('Remove package from a courier', () => {
  let courierId;
  let initialCapacity;
  let packageId = 'bar';
  let initialPackage;

  beforeEach(async () => {
    const courier = await Courier.create(validCourierParams);
    courierId = courier.courierId;
    initialPackage = {
      packageId,
      volume: 100,
    };
    const updatedCourier = await Courier.addPackage({ courierId, newPackage: initialPackage });
    initialCapacity = updatedCourier.currentCapacity;
  });

  it('removes the package from the packages list', async (done) => {
    const updatedCourier = await Courier.removePackage({ courierId, packageId });

    expect(updatedCourier).toEqual(expectCourierObject());
    expect(updatedCourier.currentCapacity).toEqual(initialCapacity + 100);
    expect(updatedCourier.packages).toEqual(expect.not.arrayContaining([initialPackage]));

    done();
  });

  it('throws an Error if the courier does not carry the given package', async (done) => {
    await expect(Courier.removePackage({ courierId, packageId: 'baz' })).rejects.toThrow();

    done();
  });
});
