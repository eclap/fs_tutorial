const request = require("supertest");
const TaskStatus = require('../../db/TaskStatus');
const app = require("../../app");

describe('POST /tasks', () => {
  it('should return error 422 on missing title', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        'status': TaskStatus.TO_DO,
        'description': 'OK'
      })
      .expect(422)
      .then(({ body }) => {
        expect(body.errors.title).toContain('Title must exists.');
      });
  });

  it('should return error 422 on missing status', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        'description': 'OK',
        'title': 'OK'
      })
      .expect(422)
      .then(({ body }) => {
        expect(body.errors.status).toContain('Status must exists.');
      });
  });

  it('should return error 422 on invalid status value.', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        'status': 'TODOS',
        'description': 'OK',
        'title': 'OK'
      })
      .expect(422)
      .then(({ body }) => {
        expect(body.errors.status).toContain('Status is invalid.');
      });
  });
});
