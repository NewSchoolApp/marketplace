import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { Order } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { InitOrderDTO } from '../dto/init-order.dto';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { ItemRepository } from '../repository/item.repository';
import { EducationPlatformIntegration } from '../integration/education-platform.integration';
import { OrderCanceledEnum } from '../enum/order-canceled.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sqsService: SqsService,
    private readonly repository: ItemRepository,
    private readonly educationPlatformIntegration: EducationPlatformIntegration,
  ) {}

  public async initCreateOrder(createOrder: InitOrderDTO) {
    const avaliableItem = await this.repository.findAvaliableById(
      createOrder.itemId,
    );
    if (!avaliableItem) {
      throw new BadRequestException(
        `Item with id ${createOrder.itemId} isn't avaliable in stock`,
      );
    }
    await this.sqsService.send('createOrder', {
      id: v4(),
      body: createOrder,
    });
  }

  public async createOrder({
    itemId,
    userId,
  }: {
    itemId: string;
    userId: string;
  }) {
    const avaliableItem = await this.repository.findAvaliableById(itemId);
    if (!avaliableItem) {
      await this.educationPlatformIntegration.createNotification({
        itemId,
        userId,
        status: OrderStatusEnum.CANCELED,
        description: OrderCanceledEnum.NOT_IN_STOCK,
      });
      return;
    }
    await this.prisma.$transaction([
      this.prisma.item.update({
        where: { id: itemId },
        data: { quantity: { decrement: 1 } },
      }),
      this.prisma.order.create({
        data: { itemId, userId, status: OrderStatusEnum.IN_ANALISIS },
      }),
    ]);
    await this.educationPlatformIntegration.createNotification({
      itemId,
      userId,
      status: OrderStatusEnum.IN_ANALISIS,
    });
  }

  public async findById(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  public getByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
    });
  }

  public async cancelOrder({
    id,
    reason,
  }: {
    id: string;
    reason: OrderCanceledEnum;
  }) {
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
    await this.educationPlatformIntegration.createNotification({
      itemId: order.itemId,
      userId: order.userId,
      status: OrderStatusEnum.CANCELED,
      description: reason,
    });
  }
}
