import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAvailableDTO } from '@modules/cars/dtos/IFindAvailableDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async findById(id: string): Promise<Car> {
    const carFound = await this.repository.findOne({
      where: { id },
    });

    return carFound;
  }

  async findAvailable({
    category_id,
    name,
    brand,
  }: IFindAvailableDTO): Promise<Car[]> {
    const carsAvailableQuery = this.repository
      .createQueryBuilder('car')
      .where('car.available = :available', { available: true });

    if (brand) {
      carsAvailableQuery.andWhere('car.brand = :brand', { brand });
    }

    if (name) {
      carsAvailableQuery.andWhere('car.name = :name', { name });
    }

    if (category_id) {
      carsAvailableQuery.andWhere('car.category_id = :category_id', {
        category_id,
      });
    }

    const carsAvailable = await carsAvailableQuery.getMany();

    return carsAvailable;
  }

  async create({
    name,
    category_id,
    brand,
    fine_amount,
    description,
    daily_rate,
    license_plate,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const carCreated = this.repository.create({
      name,
      category_id,
      brand,
      fine_amount,
      description,
      daily_rate,
      license_plate,
      specifications,
      id,
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
