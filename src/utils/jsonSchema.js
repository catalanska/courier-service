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
    packages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          volume: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
    },
  },
};

export const packageSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://gym-api/schemas/package.json',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'volume'],
  properties: {
    id: {
      type: 'string',
    },
    volume: {
      type: 'integer',
      minimum: 0,
    },
  },
};
