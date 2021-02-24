import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ItemService } from '../service/item.service';
import { Item } from '@prisma/client';
import { QueryItemDTO } from '../dto/query-item.dto';
import { Constants } from '../../CommonsModule/constants';
import { CreateItemDTO } from "../dto/create-item.dto";

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.ITEM_ENDPOINT}`,
)
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  public getAll(@Query() query: QueryItemDTO): Promise<Item[]> {
    return this.service.getAll(query);
  }

  @Post()
  public create(@Body() item: CreateItemDTO): Promise<Item> {
    return this.service.create(item);
  }

  @Get('/slug/:slug')
  public findBySlug(@Param('slug') slug: string): Promise<Item> {
    return this.service.findBySlug(slug);
  }

  @Post('/:id/quantity/increment')
  public async incrementItemQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<void> {
    await this.service.incrementItemQuantity(id, quantity);
  }

  @Post('/:id/quantity/decrement')
  public async decrementItemQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<void> {
    await this.service.decrementItemQuantity(id, quantity);
  }
}
