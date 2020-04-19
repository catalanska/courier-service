import courierModel from './courier';

export function PackageExistingError() {
  this.name = 'PackageExistingError';
  this.message = 'Package already in the courier';
  this.stack = new Error().stack;
}

export function PackageNotInCourierError() {
  this.name = 'PackageNotInCourierError';
  this.message = 'Package does not belong to this Courier';
  this.stack = new Error().stack;
}

const Courier = {
  create: async ({ courierId, maxCapacity }) => {
    return courierModel.create({ courierId, maxCapacity });
  },

  find: async ({ courierId, capacity } = {}) => {
    if (courierId) return await courierModel.findOne({ courierId });
    if (capacity) return await courierModel.find().where('currentCapacity').gte(capacity);
    return await courierModel.find();
  },

  addPackage: async ({ courier, newPackage }) => {
    const foundPackage = await courierModel.findOne({ 'packages.packageId': newPackage.packageId });

    if (foundPackage) {
      throw new PackageExistingError();
    }

    courier.packages.push(newPackage);
    courier.currentCapacity = courier.currentCapacity - newPackage.volume;
    return await courier.save();
  },

  removePackage: async ({ courier, packageId }) => {
    const pulledPackage = await courier.packages.find((item) => item.packageId === packageId);

    if (pulledPackage && pulledPackage.volume) {
      courier.packages.pull(pulledPackage);
      courier.currentCapacity = courier.currentCapacity + pulledPackage.volume;
      return await courier.save();
    } else {
      throw new PackageNotInCourierError();
    }
  },
};

export default Courier;
