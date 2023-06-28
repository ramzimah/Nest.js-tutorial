import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/users.entity';

export class ReportDto {
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  year: number;
  @Expose()
  mileage: number;
  @Expose()
  longitude: number;
  @Expose()
  latitude: number;
  @Expose()
  price: number;
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
