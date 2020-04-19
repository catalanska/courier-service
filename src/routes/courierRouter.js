import express from 'express';
import { Validator } from 'express-json-validator-middleware';

const router = express.Router();

const courierSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://gym-api/schemas/courier.json',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'max_capacity'],
  properties: {
    id: {
      type: 'string',
    },
    max_capacity: {
      type: 'integer',
      minimum: 0,
    },
  },
};

const validator = new Validator({ allErrors: true });
const { validate } = validator;

router.post('/', validate({ body: courierSchema }), function createCourier(req, res) {
  const { max_capacity: maxCapacity } = req.body;
  res.json(req.body);
});

router.get('/', function listCouriers(req, res) {
  const couriersList = [
    {
      id: 'foo',
      maxCapacity: 10000,
      currentCapacity: 5000,
    },
    {
      id: 'bar',
      maxCapacity: 30000,
      currentCapacity: 4000,
    },
  ];

  const { capacity_required: capacityRequired } = req.query;

  if (!capacityRequired) {
    res.json(couriersList);
    return;
  }
  let availableCouriers;
  try {
    availableCouriers = couriersList.filter(({ currentCapacity }) => {
      return currentCapacity >= capacityRequired;
    });
  } catch (error) {
    console.log(error);
  }

  res.json(availableCouriers);
});

export default router;
