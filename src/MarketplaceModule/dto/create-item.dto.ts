import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { ItemTypeEnum } from '../enum/item-type.enum';

export class CreateItemDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @Min(0)
  quantity: number;
  @IsEnum(ItemTypeEnum)
  type: ItemTypeEnum;
}
