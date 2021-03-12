import { IsEnum, IsNumber, IsString, Min, IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ItemTypeEnum } from '../enum/item-type.enum';

export class CreateItemDTO {
  @IsEmail()
  supportEmail: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  quantity: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  points: number;
  @IsEnum(ItemTypeEnum)
  type: ItemTypeEnum;
}
