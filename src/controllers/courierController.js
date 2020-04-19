import Courier from '../models/courierInterface';

async function createCourier(req, res) {
  const { id: courierId, max_capacity: maxCapacity } = req.body;
  await Courier.create({ courierId, maxCapacity });

  res.status(201).json(req.body);
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
