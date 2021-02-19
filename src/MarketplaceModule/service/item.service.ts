import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, PrismaPromise } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { QueryItemDTO } from '../dto/query-item.dto';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  public getAll(query: QueryItemDTO): Promise<Item[]> {
    const { page, limit, orderBy, ...other } = query;
    return this.prisma.item.findMany({
      where: other,
      skip: limit * page,
      take: limit,
      orderBy,
    });
  }

  public async findBySlug(slug: string): Promise<Item> {
    const inventory: Item = await this.prisma.item.findFirst({
      where: { slug },
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with slug "${slug}" not found`);
    }
    return inventory;
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
