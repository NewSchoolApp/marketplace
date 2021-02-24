import { ItemTypeEnum } from '../enum/item-type.enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateItemDTO {
  @IsString()
  name: string;
  @IsNumber()
  quantity: number;
  @IsEnum(ItemTypeEnum)
  type: ItemTypeEnum;
}
