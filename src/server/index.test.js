import request from 'supertest';
import server from './index';

describe('Available endpoints', () => {
  it('should return 404 when endpoint does not exist', async (done) => {
    const res = await request(server).get('/foo');
    expect(res.statusCode).toEqual(404);
    done();
  });
});
