import mongoose from 'mongoose';

// Create a simple User's schema
const courierSchema = new mongoose.Schema({
  courierId: { type: String, required: true },
  maxCapacity: { type: Number, required: true },
  currentCapacity: {
    type: Number,
    default: function () {
      return this.maxCapacity;
    },
  },
});

const courierModel = new mongoose.model('Courier', courierSchema);

export default courierModel;
