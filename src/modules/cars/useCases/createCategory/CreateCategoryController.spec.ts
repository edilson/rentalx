import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '@shared/infra/app';
import createConnection from '@shared/infra/database';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash('admin', 8);

    const id = uuidv4();

    await connection.query(`INSERT INTO USERS(id, name, email, password, admin, created_at, driver_license)
    values('${id}', 'admin', 'admin@rentalx.com.br', '${password}', true, 'now()', 'XXXXXX')`);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentalx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'New Category',
        description: 'New Category description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new category with a name that already exists', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentalx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'New Category',
        description: 'New Category description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
