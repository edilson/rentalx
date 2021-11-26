import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    driver_license,
    password,
    name,
    email,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      driver_license,
      password,
      name,
      email,
    });

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User> {
    const userFoundWithEmail = this.users.find((user) => user.email === email);

    return userFoundWithEmail;
  }

  async findById(id: string): Promise<User> {
    const userFoundWithId = this.users.find((user) => user.id === id);

    return userFoundWithId;
  }
}

export { UsersRepositoryInMemory };
