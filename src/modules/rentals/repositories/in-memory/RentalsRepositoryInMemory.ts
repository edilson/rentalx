import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async create({
    car_id,
    expected_return_date,
    user_id,
  }: ICreateRentalDTO): Promise<Rental> {
    const rentalCreated = new Rental();

    Object.assign(rentalCreated, {
      car_id,
      expected_return_date,
      user_id,
      start_date: new Date(),
    });

    this.rentals.push(rentalCreated);

    return rentalCreated;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const rentalFound = this.rentals.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );

    return rentalFound;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const rentalFound = this.rentals.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );

    return rentalFound;
  }
}

export { RentalsRepositoryInMemory };
