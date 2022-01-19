import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from '../createCar/CreateCarUserCase';
import { CreateSpecificationUseCase } from '../createSpecification/CreateSpecificationUseCase';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let createCarUseCase: CreateCarUseCase;
let createSpecificationUseCase: CreateSpecificationUseCase;

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  let car1: Car;

  let specification1: Specification;

  beforeEach(async () => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();

    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory
    );

    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );

    specification1 = await createSpecificationUseCase.execute({
      name: 'SUV',
      description: 'Categoria SUV de carros',
    });

    car1 = await createCarUseCase.execute({
      name: 'Car Available',
      brand: 'Brand',
      category_id: 'category-id',
      fine_amount: 60,
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'CBI-2032',
    });
  });

  it('should be able to add a new specification to the car', async () => {
    const carAssociatedWithSpecification =
      await createCarSpecificationUseCase.execute({
        car_id: car1.id,
        specifications_id: [specification1.id],
      });

    expect(carAssociatedWithSpecification).toHaveProperty('specifications');
    expect(carAssociatedWithSpecification.specifications.length).toEqual(1);
    expect(carAssociatedWithSpecification.specifications).toEqual([
      specification1,
    ]);
  });

  it('should not be able to add a new specification to a car that does not exist', async () => {
    expect(async () => {
      await createCarSpecificationUseCase.execute({
        car_id: 'invalid-car-id',
        specifications_id: ['invalid-car-specification'],
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
