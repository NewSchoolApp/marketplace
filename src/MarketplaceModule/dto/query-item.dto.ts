import { FilterQueryDTO } from '../../CommonsModule/dto/filter-params.dto';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ItemTypeEnum } from '../enum/item-type.enum';
import { Transform, Type } from 'class-transformer';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';

export type Enumerable<T> = T | Array<T>;

export class StringFilter {
  equals?: string;
  in?: Enumerable<string>;
  notIn?: Enumerable<string>;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  not?: NestedStringFilter | string;
}

export class NestedStringFilter {
  equals?: string;
  in?: Enumerable<string>;
  notIn?: Enumerable<string>;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  not?: NestedStringFilter | string;
}

export class IntFilter {
  equals?: number;
  in?: Enumerable<number>;
  notIn?: Enumerable<number>;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  not?: NestedIntFilter | number;
}

export class NestedIntFilter {
  equals?: number;
  in?: Enumerable<number>;
  notIn?: Enumerable<number>;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  not?: NestedIntFilter | number;
}

export class BoolFilter {
  equals?: boolean;
  not?: NestedBoolFilter | boolean;
}

export class NestedBoolFilter {
  equals?: boolean;
  not?: NestedBoolFilter | boolean;
}

class ItemDTO {
  type: ItemTypeEnum;
  enabled: boolean;
  quantity: number;
  name: string;
  slug: string;
  status: string;
  updatedBy: string;
}

export class QueryItemDTO extends FilterQueryDTO<ItemDTO> {
  @IsEnum(ItemTypeEnum)
  @IsOptional()
  type?: ItemTypeEnum;
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  slug?: string;
  @IsString()
  @IsOptional()
  status?: string;
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
