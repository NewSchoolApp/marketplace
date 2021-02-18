import { OrderEnum } from '../enum/order.enum';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class FilterQueryDTO<T> {
  @IsNumber()
  @Min(1)
  page: number;
  @IsNumber()
  @Min(1)
  limit: number;
  @IsOptional()
  orderBy?: Record<keyof T, OrderEnum>;
}
