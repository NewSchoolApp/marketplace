import { Injectable, NotFoundException } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { Order } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { InitOrderDTO } from '../dto/init-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sqsService: SqsService,
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

  public async initCreateOrder(createOrder: InitOrderDTO) {
    await this.sqsService.send('createOrder', {
      id: v4(),
      body: createOrder,
      delaySeconds: 0,
    });
  }
}
