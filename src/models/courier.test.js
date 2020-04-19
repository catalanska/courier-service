import Courier from './Courier';

describe('New Courier', () => {
  describe('Valid params', () => {
    it('create & save courier successfully', async () => {
      const courier = new Courier({
        id: 'foo',
        maxCapacity: 2000,
      });

      const savedCourier = await courier.save();

      expect(savedCourier).toEqual(
        expect.objectContaining({
          courierID: 'foo',
          maxCapacity: 2000,
          currentCapacity: 0,
        })
      );
    });
  });

  describe('Invalid params', () => {
    it('courier cannot be created', async () => {
      const courier = new Courier({
        id: 'foo',
      });

      let err;
      try {
        await courier.save();
      } catch (error) {
        err = error;
      }
      expect(err.errors.maxCapacity).toBeDefined();
    });
  });
});
