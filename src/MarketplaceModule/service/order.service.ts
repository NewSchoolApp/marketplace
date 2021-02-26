import { Injectable, NotFoundException } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { Order } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { InitOrderDTO } from '../dto/init-order.dto';
import { OrderStatusEnum } from '../enum/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sqsService: SqsService,
  ) {}

  public async createOrder({
    itemId,
    userId,
  }: {
    itemId: string;
    userId: string;
  }) {
    await this.prisma.$transaction([
      this.prisma.item.update({
        where: { id: itemId },
        data: { quantity: { decrement: 1 } },
      }),
      this.prisma.order.create({
        data: { itemId, userId, status: OrderStatusEnum.IN_ANALISIS },
      }),
    ]);
    // chamar endpoint de criar notificação na plataforma de educação
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

  public async cancelOrder({ id, reason }: { id: string; reason: string }) {
    const order = await this.findById(id);
    this.prisma.$transaction([
      this.prisma.order.update({
        where: { id },
        data: {
          content: { cancelation: { date: Date.now(), reason } },
          status: OrderStatusEnum.CANCELED,
        },
      }),
      this.prisma.item.update({
        where: { id: order.itemId },
        data: { quantity: { increment: 1 } },
      }),
    ]);
    // chamar endpoint de criar notificação
  }
}
