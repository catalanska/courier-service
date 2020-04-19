import Courier from '../models/courierInterface';

async function createCourier(req, res) {
  const { id: courierId, max_capacity: maxCapacity } = req.body;

  try {
    const newCourier = await Courier.create({ courierId, maxCapacity });
    res.status(201).json(newCourier);
  } catch (error) {
    if (error.message.match(/duplicate key/)) {
      const courier = await Courier.find({ courierId });
      res.status(200).json(courier);
    } else throw error;
  }
}

async function listCouriers(req, res) {
  const { capacity_required: capacity } = req.query;
  const availableCouriers = await Courier.find({ capacity });

  res.status(200).json(availableCouriers);
}

export default {
  createCourier,
  listCouriers,
};
