import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { Inventory } from '@prisma/client';
import { QueryInventoryDTO } from '../dto/query-inventory.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('/api/v1/inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  // @ApiQuery({ type: QueryInventoryDTO })
  public getAll(@Query() { query }: QueryInventoryDTO): Promise<Inventory[]> {
    return this.service.getAll(query as any);
  }

  @Get('/slug/:slug')
  public findBySlug(@Param('slug') slug: string): Promise<Inventory> {
    return this.service.findBySlug(slug);
  }

  @Get('/slug/:slug/orders')
  public getOrdersByInventorySlug(@Param('slug') slug: string) {
    return this.service.getOrdersByInventorySlug(slug);
  }
}
