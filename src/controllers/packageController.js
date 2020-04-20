import Courier, {
  PackageExistingError,
  PackageNotInCourierError,
} from '../models/courierInterface';

async function createPackage(req, res) {
  const { id: courierId } = req.params;
  const { id: packageId, volume } = req.body;

  const courier = await Courier.find({ courierId });

  if (!courier) res.status(404).send();

  try {
    const updatedCourier = await Courier.addPackage({
      courier,
      newPackage: { packageId, volume },
    });
    res.status(201).json(updatedCourier);
  } catch (error) {
    if (error instanceof PackageExistingError) {
      res.status(200).json(courier);
    } else throw error;
  }
}

async function deletePackage(req, res) {
  const { id: courierId, package_id: packageId } = req.params;

  const courier = await Courier.find({ courierId });

  if (!courier) res.status(404).send();

  try {
    const updatedCourier = await Courier.removePackage({ courier, packageId });
    res.status(200).json(updatedCourier);
  } catch (error) {
    if (error instanceof PackageNotInCourierError) {
      res.status(404).json();
    } else throw error;
  }
}

export default {
  createPackage,
  deletePackage,
};
