import Courier from './Courier';

describe('New Courier', () => {
  describe('Valid params', () => {
    it('create & save courier successfully', async (done) => {
      const courier = new Courier({
        courierId: 'foo',
        maxCapacity: 2000,
      });

      const savedCourier = await courier.save();

      expect(savedCourier).toEqual(
        expect.objectContaining({
          __v: expect.any(Number),
          _id: expect.anything(),
          courierId: 'foo',
          maxCapacity: 2000,
          currentCapacity: 0,
        })
      );
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
