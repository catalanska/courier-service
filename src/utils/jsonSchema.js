export const courierSchema = {
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
