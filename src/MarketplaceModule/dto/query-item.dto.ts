import { FilterQueryDTO } from '../../CommonsModule/dto/filter-params.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ItemTypeEnum } from '../enum/item-type.enum';
import { Transform } from 'class-transformer';

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

function transformIntObject(value: Record<string, any>) {
  const returnObject: Record<string, any> = {};
  if (value.equals) returnObject.equals = Number(value?.equals);
  if (value.in) returnObject.in = value.in.map((inValue) => Number(inValue));
  if (value.notIn)
    returnObject.notIn = value.notIn.map((inValue) => Number(inValue));
  if (value.lt) returnObject.lt = Number(value.lt);
  if (value.lte) returnObject.lte = Number(value.lte);
  if (value.gt) returnObject.gt = Number(value.gt);
  if (value.gte) returnObject.gte = Number(value.gte);
  return returnObject;
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
  @IsOptional()
  enabled?: boolean | BoolFilter;
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'object') {
      return transformIntObject(value);
    }
    return Number(value);
  })
  quantity?: number | IntFilter;
  @IsOptional()
  name?: string | StringFilter;
  @IsOptional()
  slug?: string | StringFilter;
  @IsOptional()
  status?: string | StringFilter;
  @IsOptional()
  updatedBy?: string | StringFilter;
}
