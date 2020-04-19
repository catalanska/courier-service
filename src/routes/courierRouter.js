import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import courierController from '../controllers/courierController';
import packageController from '../controllers/packageController';
import { courierSchema } from '../utils/jsonSchema';

const router = express.Router();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const handleErrorAsync = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    next(error);
  }
};

router.post(
  '/',
  validate({ body: courierSchema }),
  handleErrorAsync(courierController.createCourier)
);
router.get('/', handleErrorAsync(courierController.listCouriers));
router.put('/:id/packages', handleErrorAsync(packageController.createPackage));
router.delete('/:id/packages/:package_id', handleErrorAsync(packageController.deletePackage));

export default router;
