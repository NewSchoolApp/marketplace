import { IsString } from 'class-validator';

export class InitOrderDTO {
  @IsString()
  itemId: string;
  @IsString()
  userId: string;
}
