import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import courierController from '../controllers/courierController';
import packageController from '../controllers/packageController';

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

const handleErrorAsync = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    next(error);
  }
};

router.post('/', validate({ body: courierSchema }), courierController.createCourier);
router.get('/', courierController.listCouriers);
router.put(
  '/:id/packages',
  handleErrorAsync(async (req, res, next) => {
    let result = await packageController.createPackage(req, res);
    if (result) {
      res.send(result);
    }
  })
);
router.delete('/:id/packages/:package_id', packageController.deletePackage);

export default router;
