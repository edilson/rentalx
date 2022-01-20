import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateCarUseCase } from '@modules/cars/useCases/createCar/CreateCarUserCase';
import { AppError } from '@shared/errors/AppError';

import { Rental } from '../infra/typeorm/entities/Rental';
import { RentalsRepositoryInMemory } from '../repositories/in-memory/RentalsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

let createRentalUseCase: CreateRentalUseCase;
let createCarUseCase: CreateCarUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Create Rental', () => {
  let car1: Car;
  let car2: Car;

  let user1: User;
  let user2: User;

  beforeEach(async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();

    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    const userData1 = {
      driver_license: '000123',
      email: 'user@test.com',
      password: '1234',
      name: 'User test',
    };

    const userData2 = {
      driver_license: '883746',
      email: 'awesome_user@test.com',
      password: '8837',
      name: 'Awesome User test',
    };

    await createUserUseCase.execute(userData1);
    await createUserUseCase.execute(userData2);

    user1 = await usersRepositoryInMemory.findByEmail(userData1.email);

    user2 = await usersRepositoryInMemory.findByEmail(userData2.email);

    car1 = await createCarUseCase.execute({
      name: 'Name Car',
      brand: 'Brand',
      category_id: 'category-id',
      fine_amount: 60,
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
    });

    car2 = await createCarUseCase.execute({
      name: 'Awesome Name Car',
      brand: 'Awesome Brand',
      category_id: 'awesome-category-id',
      fine_amount: 80,
      description: 'Awesome Description Car',
      daily_rate: 140,
      license_plate: 'CBI-2008',
    });

    await createRentalUseCase.execute({
      car_id: car2.id,
      user_id: user1.id,
      expected_return_date: new Date(2022, 3, 20),
    });
  });

  it('should be able to create a new rental', async () => {
    const rentalCreated = await createRentalUseCase.execute({
      car_id: '124',
      user_id: '32432',
      expected_return_date: new Date(),
    });

    expect(rentalCreated).toHaveProperty('id');
    expect(rentalCreated.start_date).not.toBeNull();
  });

  it('should not be able to rent a car when the user has a rent already open', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: user1.id,
        car_id: car1.id,
        expected_return_date: new Date(2022, 3, 8),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to rent a car when the car is already rented', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: user2.id,
        car_id: car1.id,
        expected_return_date: new Date(2022, 3, 8),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
