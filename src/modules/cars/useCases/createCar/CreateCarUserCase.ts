import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
}

@injectable()
class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    name,
    brand,
    category_id,
    license_plate,
    fine_amount,
    daily_rate,
    description,
  }: IRequest): Promise<Car> {
    const carWithGivenLicensePlateAlreadyExists =
      await this.carsRepository.findByLicensePlate(license_plate);

    if (carWithGivenLicensePlateAlreadyExists) {
      throw new AppError('Car with this license plate already exists!');
    }

    const carCreated = await this.carsRepository.create({
      name,
      brand,
      category_id,
      license_plate,
      fine_amount,
      daily_rate,
      description,
    });

    return carCreated;
  }
}

export { CreateCarUseCase };
