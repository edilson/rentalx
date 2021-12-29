import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from '../createCar/CreateCarUserCase';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let createCarUseCase: CreateCarUseCase;

describe('List Cars', () => {
  let car1: Car;
  let car2: Car;

  beforeEach(async () => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);

    car1 = await createCarUseCase.execute({
      name: 'Car1',
      description: 'Carro com espaço',
      daily_rate: 110.0,
      license_plate: 'DEF-1234',
      fine_amount: 40,
      brand: 'Audi',
      category_id: 'a-nice-category-id',
    });

    car2 = await createCarUseCase.execute({
      name: 'Car2',
      description: 'Carro esportivo',
      daily_rate: 180.0,
      license_plate: 'FDA-5589',
      fine_amount: 80,
      brand: 'Ferrari',
      category_id: 'a-cool-category-id',
    });
  });

  it('should be able to list all available cars', async () => {
    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car1, car2]);
  });

  it('should be able to list all available cars by brand', async () => {
    const carsWithAGivenBrand = await listAvailableCarsUseCase.execute({
      brand: 'Ferrari',
    });

    expect(carsWithAGivenBrand).toEqual([car2]);
  });

  it('should be able to list all available cars by name', async () => {
    const carsWithAGivenName = await listAvailableCarsUseCase.execute({
      name: 'Car1',
    });

    expect(carsWithAGivenName).toEqual([car1]);
  });

  it('should be able to list all available cars by category', async () => {
    const carsWithAGivenName = await listAvailableCarsUseCase.execute({
      category_id: 'a-cool-category-id',
    });

    expect(carsWithAGivenName).toEqual([car2]);
  });
});
