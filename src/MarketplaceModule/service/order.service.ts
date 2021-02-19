import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { ItemService } from './item.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly itemService: ItemService,
  ) {}

  public async createOrder(itemId: string, userId: string) {
    this.prisma.$transaction([
      this.prisma.item.update({
        data: { quantity: { decrement: 1 } },
        where: { id: itemId },
      }),
      this.prisma.order.create({
        data: { itemId, userId },
      }),
    ]);
  }

  public async findById(id: string): Promise<Order> {
    const order = this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  public async getByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
    });
  }
}
