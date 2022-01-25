import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    car_id,
    expected_return_date,
    user_id,
  }: ICreateRentalDTO): Promise<Rental> {
    const rentalCreated = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
    });

    await this.repository.save(rentalCreated);

    return rentalCreated;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const openRentalFoundByCar = await this.repository.findOne({
      where: { car_id, end_date: null },
    });

    return openRentalFoundByCar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const openRentalFoundByCar = await this.repository.findOne({
      where: { user_id, end_date: null },
    });

    return openRentalFoundByCar;
  }
}

export { RentalsRepository };
