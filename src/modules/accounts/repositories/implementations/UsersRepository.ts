import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User> {
    const userFoundWithGivenEmail = await this.repository.findOne({
      where: { email },
    });

    return userFoundWithGivenEmail;
  }

  async findById(id: string): Promise<User> {
    const userFoundWithGivenId = await this.repository.findOne({
      where: { id },
    });

    return userFoundWithGivenId;
  }

  async create({
    name,
    driver_license,
    password,
    email,
    id,
    avatar,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
      driver_license,
      password,
      email,
      id,
      avatar,
    });

    await this.repository.save(user);
  }
}

export { UsersRepository };
