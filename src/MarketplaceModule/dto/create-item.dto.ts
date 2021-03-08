import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { ItemTypeEnum } from '../enum/item-type.enum';

export class CreateItemDTO {
  @IsString()
  supportEmail: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @Min(0)
  quantity: number;
  @IsNumber()
  @Min(0)
  points: number;
  photo: any;
  @IsEnum(ItemTypeEnum)
  type: ItemTypeEnum;
}
