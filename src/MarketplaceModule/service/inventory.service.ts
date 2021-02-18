import { Injectable, NotFoundException } from '@nestjs/common';
import { Inventory, Product } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { QueryInventory } from '../dto/query-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  public getAll(query: QueryInventory): Promise<Inventory[]> {
    const { page, limit, orderBy, ...other } = query as any;
    return this.prisma.inventory.findMany({
      where: other,
      skip: limit * page,
      take: limit,
      orderBy,
    });
  }

  public async findBySlug(slug: string): Promise<Inventory> {
    const inventory: Inventory = await this.prisma.inventory.findFirst({
      where: { slug },
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with slug "${slug}" not found`);
    }
    return inventory;
  }

  public async getOrdersByInventorySlug(slug: string) {
    const inventory: Inventory & {
      products: Product[];
    } = await this.prisma.inventory.findFirst({
      where: {
        slug,
        products: { some: { requestingUserId: { not: null } } },
      },
      include: {
        products: true,
      },
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with slug "${slug}" not found`);
    }
    return inventory.products;
  }
}
