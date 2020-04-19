import courierModel from './courier';

const Courier = {
  create: async ({ courierId, maxCapacity }) => {
    return courierModel.create({ courierId, maxCapacity });
  },

  find: async ({ capacity } = {}) => {
    if (capacity) return await courierModel.find().where('currentCapacity').gte(capacity);
    return await courierModel.find();
  },

  addPackage: async ({ courierId, newPackage }) => {
    const courier = await courierModel.findOne({ courierId });
    courier.packages.push(newPackage);
    courier.currentCapacity = courier.currentCapacity - newPackage.volume;
    return await courier.save();
  },

  removePackage: async ({ courierId, packageId }) => {
    const courier = await courierModel.findOne({ courierId });
    const pulledPackage = await courier.packages.find((item) => item.packageId === packageId);
    if (!pulledPackage) throw new Error('Package does not belong to this Courier');

    courier.packages.pull(pulledPackage);
    courier.currentCapacity = courier.currentCapacity + pulledPackage.volume;
    return await courier.save();
  },
};

export default Courier;
