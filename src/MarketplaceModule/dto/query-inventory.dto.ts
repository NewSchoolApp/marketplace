import { FilterQueryDTO } from '../../CommonsModule/dto/filter-params.dto';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

class InventoryDTO {
  slug?: string;
  name?: string;
  points?: number;
}

export class QueryInventory extends FilterQueryDTO<InventoryDTO> {
  slug?: StringFilter;
  name?: StringFilter;
  points?: IntFilter;
}

class Teste2 {
  testeName2: string;
}

class Teste {
  testeName: Teste2;
}

export class QueryInventoryDTO {
  query: QueryInventory;
}
