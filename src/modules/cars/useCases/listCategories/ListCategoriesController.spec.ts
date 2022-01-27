import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '@shared/infra/app';
import createConnection from '@shared/infra/database';

let connection: Connection;

describe('List Categories Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash('admin', 8);

    const idUser = uuidv4();
    const idCategory = uuidv4();

    await connection.query(`INSERT INTO USERS(id, name, email, password, admin, created_at, driver_license)
    values('${idUser}', 'admin', 'admin@rentalx.com.br', '${password}', true, 'now()', 'XXXXXX')`);

    await connection.query(`INSERT INTO CATEGORIES(id, name, description, created_at)
    values('${idCategory}', 'New Category', 'New Category description', 'now()')`);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all available categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentalx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get('/categories')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].name).toEqual('New Category');
  });
});
