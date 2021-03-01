import { IsNumber, Min } from 'class-validator';

export class IncrementDecrementBodyDTO {
  @IsNumber()
  @Min(0)
  quantity: number;
}
