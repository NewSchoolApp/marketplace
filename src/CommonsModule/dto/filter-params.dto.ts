import { OrderEnum } from '../enum/order.enum';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterQueryDTO<T> {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;
  @IsOptional()
  orderBy?: Record<keyof T, OrderEnum>;
}
