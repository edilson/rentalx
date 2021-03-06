import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const userFound = await this.usersRepository.findByEmail(email);

    if (!userFound) {
      throw new AppError('Email or password incorrect!');
    }

    const passwordMatch = await compare(password, userFound.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!');
    }

    const token = sign({}, process.env.AUTH_SECRET, {
      subject: userFound.id,
      expiresIn: '1d',
    });

    return {
      user: {
        name: userFound.name,
        email: userFound.email,
      },
      token,
    };
  }
}

export { AuthenticateUserUseCase };
