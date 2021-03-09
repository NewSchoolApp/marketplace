import slugify from 'slugify';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Item, PrismaPromise } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { QueryItemDTO } from '../dto/query-item.dto';
import { CreateItemDTO } from '../dto/create-item.dto';
import { ItemRepository } from '../repository/item.repository';
import { ErrorCodeEnum } from '../../CommonsModule/enum/error-code.enum';

@Injectable()
export class ItemService {
  constructor(
    private readonly repository: ItemRepository,
    private readonly prisma: PrismaService,
  ) {}

  public getAll(query: QueryItemDTO): Promise<Item[]> {
    const { page, limit, orderBy, ...other } = query;
    return this.prisma.item.findMany({
      where: other,
      skip: limit * (page - 1),
      take: limit,
      orderBy,
    });
  }

  public async create(item: CreateItemDTO) {
    return this.prisma.item.create({
      data: { ...item, slug: slugify(item.name), photo: '' },
    });
  }

  public async findBySlug(slug: string): Promise<Item> {
    const item: Item = await this.prisma.item.findFirst({
      where: { slug },
    });
    if (!item) {
      throw new NotFoundException(`Item with slug "${slug}" not found`);
    }
    return item;
  }

  public async findAvailableById(
    {
      id,
      minQuantity,
    }: {
      id: string;
      minQuantity: number;
    } = { id: null, minQuantity: 0 },
  ) {
    const availableItem = await this.repository.findAvailableById({
      id,
      minQuantity: minQuantity,
    });
    if (!availableItem) {
      throw new BadRequestException({
        message: `Item with id ${id} doesn't have the ordered quantity`,
        errorCode: ErrorCodeEnum.NOT_IN_STOCK,
      });
    }
    return availableItem;
  }

  public async findById(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new BadRequestException({
        message: `Item with id ${id} doesn't have the ordered quantity`,
        errorCode: ErrorCodeEnum.NOT_IN_STOCK,
      });
    }
    return item;
  }

  public async incrementItemQuantity(
    id: string,
    quantity: number,
  ): Promise<void> {
    await this.prisma.item.update({
      data: { quantity: { increment: quantity } },
      where: { id },
    });
  }

  public async decrementItemQuantity(
    id: string,
    quantity: number,
  ): Promise<PrismaPromise<void>> {
    await this.prisma.item.update({
      data: { quantity: { decrement: quantity } },
      where: { id },
    });
  }
}
