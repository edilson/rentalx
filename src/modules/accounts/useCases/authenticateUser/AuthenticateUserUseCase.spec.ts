import { AppError } from '../../../../errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

let user: ICreateUserDTO;

describe('Authenticate User', () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    user = {
      driver_license: '000123',
      email: 'user@test.com',
      password: '1234',
      name: 'User test',
    };

    await createUserUseCase.execute(user);
  });

  it('should be able to authenticate an user', async () => {
    const authenticationResponse = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticationResponse).toHaveProperty('token');
    expect(authenticationResponse).toHaveProperty('user');
    expect(authenticationResponse.user).toHaveProperty('name');
    expect(authenticationResponse.user).toHaveProperty('email');
  });

  it('should not be able to authenticate an user that does not exists', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with invalid password', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrect-password',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
