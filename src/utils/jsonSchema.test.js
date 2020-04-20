import Ajv from 'ajv';
import { courierSchema, packageSchema } from './jsonSchema';

describe('Exported schemas', () => {
  it('exports courierSchema & packageSchema', () => {
    expect(packageSchema).toBeDefined();
    expect(courierSchema).toBeDefined();
  });
});

describe('courierSchema schema', () => {
  let validate;
  beforeEach(() => {
    const ajv = new Ajv();
    validate = ajv.compile(courierSchema);
  });

  it('returns valid if id and max_capacity are valid', () => {
    const validCourier = { id: 'foo', max_capacity: 1 };
    const courierWithoutId = { max_capacity: 1 };
    const courierWithInvalidCapacity = { id: 'foo', max_capacity: -1 };

    expect(validate(validCourier)).toBeTruthy();
    expect(validate(courierWithoutId)).toBeFalsy();
    expect(validate(courierWithInvalidCapacity)).toBeFalsy();
  });
});

describe('packageSchema schema', () => {
  let validate;
  beforeEach(() => {
    const ajv = new Ajv();
    validate = ajv.compile(packageSchema);
  });

  it('returns valid if id and max_capacity are valid', () => {
    const validPackage = { id: 'bar', volume: 100 };
    const packageWithoutId = { volume: 1 };
    const packageWithInvalidVolume = { id: 'bar', volume: -1 };

    expect(validate(validPackage)).toBeTruthy();
    expect(validate(packageWithoutId)).toBeFalsy();
    expect(validate(packageWithInvalidVolume)).toBeFalsy();
  });
});
