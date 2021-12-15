import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUserCase';

let createCarUseCase: CreateCarUseCase;

let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const carCreated = await createCarUseCase.execute({
      name: 'Name Car',
      brand: 'Brand',
      category_id: 'category-id',
      fine_amount: 60,
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
    });

    expect(carCreated).toHaveProperty('id');
  });

  it('should not be able to create a car with the same license plate', () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'Car1',
        brand: 'Brand',
        category_id: 'category-id',
        fine_amount: 60,
        description: 'Description Car',
        daily_rate: 100,
        license_plate: 'ABC-1234',
      });

      await createCarUseCase.execute({
        name: 'Car2',
        brand: 'Brand',
        category_id: 'category-id',
        fine_amount: 60,
        description: 'Description Car',
        daily_rate: 100,
        license_plate: 'ABC-1234',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a car with available true by default', async () => {
    const carCreated = await createCarUseCase.execute({
      name: 'Car Available',
      brand: 'Brand',
      category_id: 'category-id',
      fine_amount: 60,
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'CBI-2032',
    });

    expect(carCreated.available).toBe(true);
  });
});
