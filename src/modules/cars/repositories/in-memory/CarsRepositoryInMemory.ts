import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const carFound = this.cars.find(
      (car) => car.license_plate === license_plate
    );

    return carFound;
  }

  async create({
    license_plate,
    daily_rate,
    description,
    fine_amount,
    brand,
    category_id,
    name,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      license_plate,
      daily_rate,
      description,
      fine_amount,
      brand,
      category_id,
      name,
    });

    this.cars.push(car);

    return car;
  }
}

export { CarsRepositoryInMemory };
