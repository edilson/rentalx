import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    name,
    category_id,
    brand,
    fine_amount,
    description,
    daily_rate,
    license_plate,
  }: ICreateCarDTO): Promise<Car> {
    const carCreated = this.repository.create({
      name,
      category_id,
      brand,
      fine_amount,
      description,
      daily_rate,
      license_plate,
    });

    await this.repository.save(carCreated);

    return carCreated;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const carFound = await this.repository.findOne({
      where: { license_plate },
    });

    return carFound;
  }
}

export { CarsRepository };
