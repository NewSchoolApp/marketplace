import slugify from 'slugify';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, PrismaPromise } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { QueryItemDTO } from '../dto/query-item.dto';
import { CreateItemDTO } from '../dto/create-item.dto';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

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
      data: { ...item, slug: slugify(item.name) },
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
