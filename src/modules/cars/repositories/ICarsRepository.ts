import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IFindAvailableDTO } from '../dtos/IFindAvailableDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  findAvailable(data: IFindAvailableDTO): Promise<Car[]>;
  findById(id: string): Promise<Car>;
}

export { ICarsRepository };
