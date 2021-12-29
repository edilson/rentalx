import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAvailableDTO } from '@modules/cars/dtos/IFindAvailableDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async findAvailable({
    name,
    brand,
    category_id,
  }: IFindAvailableDTO): Promise<Car[]> {
    const carsAvailable = this.cars.filter((car) => {
      if (
        (!brand && !name && !category_id && car.available === true) ||
        (brand && car.brand === brand && car.available === true) ||
        (name && car.name === name && car.available === true) ||
        (category_id &&
          car.category_id === category_id &&
          car.available === true)
      ) {
        return car;
      }

      return null;
    });

    return carsAvailable;
  }

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
