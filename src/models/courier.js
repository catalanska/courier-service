import mongoose from 'mongoose';

const courierSchema = new mongoose.Schema({
  courierId: { type: String, required: true, index: true, unique: true },
  maxCapacity: { type: Number, required: true },
  currentCapacity: {
    type: Number,
    min: 0,
    default: function () {
      return this.maxCapacity;
    },
    validate: {
      validator: function (v) {
        return v <= this.maxCapacity;
      },
    },
  },
  packages: [
    { packageId: { type: String, index: true, unique: true, sparse: true }, volume: Number },
  ],
});

const courierModel = new mongoose.model('Courier', courierSchema);

export default courierModel;
