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
    currentCapacity: expect.any(Number),
    packages: expect.any(Array),
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
    expect(updatedCourier.packages).toEqual(expect.arrayContaining(newPackage));

    done();
  });

  it('throws an Error if the courier cannot carry the new package', async (done) => {
    const { courierId } = courier;
    const newPackage = {
      packageId: 'bar',
      volume: 500000,
    };

    let err;
    try {
      await Courier.addPackage({ courierId, newPackage });
    } catch (error) {
      err = error;
    }
    expect(err.errors.currentCapacity).toBeDefined();

    done();
  });
});

describe('Remove package from a courier', () => {
  let courier;
  let packageId;

  beforeEach(async () => {
    courier = await Courier.create(validCourierParams);
    const newPackage = {
      packageId: 'bar',
      volume: 500000,
    };
    const existingPackage = await Courier.addPackage({ courierId: courier.courierId, newPackage });
    packageId = existingPackage.packageId;
  });

  it('removes the package from the packages list', async (done) => {
    const { courierId, currentCapacity } = courier;

    const updatedCourier = await Courier.removePackage({ courierId, packageId });

    expect(updatedCourier).toEqual(expectCourierObject());
    expect(updatedCourier.currentCapacity).toEqual(currentCapacity + 100);
    expect(updatedCourier.packages).toEqual(expect.not.arrayContaining(newPackage));

    done();
  });

  it('throws an Error if the courier does not carry the given package', async (done) => {
    const { courierId } = courier;

    let err;
    try {
      updatedCourier = await Courier.removePackage({ courierId, packageId: 'baz' });
    } catch (error) {
      err = error;
    }

    expect(err.errors.packages).toBeDefined();

    done();
  });
});
