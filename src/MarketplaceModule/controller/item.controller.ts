import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Item } from '@prisma/client';
import { ItemService } from '../service/item.service';
import { QueryItemDTO } from '../dto/query-item.dto';
import { Constants } from '../../CommonsModule/constants';
import { CreateItemDTO } from '../dto/create-item.dto';
import { IncrementDecrementBodyDTO } from '../dto/increment-decrement-body.dto';
import { PageableDTO } from "../../CommonsModule/dto/pageable.dto";

@ApiTags('Item')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.ITEM_ENDPOINT}`,
)
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  public getAll(@Query() query: QueryItemDTO): Promise<PageableDTO<Item>> {
    return this.service.getAll(query);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public create(
    @Body() item: CreateItemDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Item> {
    if (!file) throw new BadRequestException('file not found')
    return this.service.create({ ...item, file });
  }

  @Get('/slug/:slug')
  public findBySlug(@Param('slug') slug: string): Promise<Item> {
    return this.service.findBySlug(slug);
  }

  @Post('/:id/quantity/increment')
  public async incrementItemQuantity(
    @Param('id') id: string,
    @Body() { quantity }: IncrementDecrementBodyDTO,
  ): Promise<void> {
    await this.service.incrementItemQuantity(id, quantity);
  }

  @Post('/:id/quantity/decrement')
  public async decrementItemQuantity(
    @Param('id') id: string,
    @Body() { quantity }: IncrementDecrementBodyDTO,
  ): Promise<void> {
    await this.service.decrementItemQuantity(id, quantity);
  }
}
