import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SqsService } from '@ssut/nestjs-sqs';
import { Order, Item } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { InitOrderDTO } from '../dto/init-order.dto';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { EducationPlatformIntegration } from '../integration/education-platform.integration';
import { OrderCanceledEnum } from '../enum/order-canceled.enum';
import { ItemService } from './item.service';
import { ItemRepository } from '../repository/item.repository';
import { OrderRepository } from '../repository/order.repository';
import { ContentDTO } from '../dto/init-order.dto';
import { ItemTypeEnum } from '../enum/item-type.enum';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { ErrorCodeEnum } from '../../CommonsModule/enum/error-code.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sqsService: SqsService,
    private readonly itemService: ItemService,
    private readonly educationPlatformIntegration: EducationPlatformIntegration,
    private readonly itemRepository: ItemRepository,
    private readonly repository: OrderRepository,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async initCreateOrder(createOrder: InitOrderDTO) {
    await this.itemService.findById(createOrder.itemId);
    const item = await this.itemService.findAvailableById({
      id: createOrder.itemId,
      minQuantity: createOrder.quantity,
    });
    const [
      {
        data: { points },
      },
      userUsedPoints,
    ] = await Promise.all([
      this.educationPlatformIntegration.getUserRanking(createOrder.userId),
      this.getUserUsedPoints(createOrder.userId),
    ]);
    const avaliablePoints = Number(points) - userUsedPoints;
    const neededPointsForPurchase = createOrder.quantity * item.points;
    if (avaliablePoints < neededPointsForPurchase) {
      throw new BadRequestException({
        message: `You need ${neededPointsForPurchase} points to make this purchase, but you only have ${avaliablePoints} avaliable`,
        errorCode: ErrorCodeEnum.NOT_ENOUGH_POINTS,
      });
    }
    await this.sqsService.send('createOrder', {
      id: v4(),
      body: createOrder,
      groupId: v4(),
      deduplicationId: v4(),
    });
  }

  public async createOrder({
    itemId,
    userId,
    quantity,
    content,
  }: InitOrderDTO) {
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      await this.educationPlatformIntegration.createNotification({
        itemId,
        userId,
        quantity,
        points: null,
        status: OrderStatusEnum.CANCELED,
        content: {
          cancelation: {
            date: Date.now(),
            reason: OrderCanceledEnum.DOES_NOT_EXISTS,
          },
        },
      });
      return;
    }
    const availableItem = await this.itemRepository.findAvailableById({
      id: itemId,
      minQuantity: quantity,
    });
    if (!availableItem) {
      await this.educationPlatformIntegration.createNotification({
        itemId,
        userId,
        quantity,
        points: item.points,
        status: OrderStatusEnum.CANCELED,
        content: {
          cancelation: {
            date: Date.now(),
            reason: OrderCanceledEnum.NOT_IN_STOCK,
          },
        },
      });
      return;
    }
    const [
      {
        data: { points },
      },
      userUsedPoints,
    ] = await Promise.all([
      this.educationPlatformIntegration.getUserRanking(userId),
      this.getUserUsedPoints(userId),
    ]);
    const avaliablePoints = Number(points) - userUsedPoints;
    const neededPointsForPurchase = quantity * availableItem.points;
    if (avaliablePoints < neededPointsForPurchase) {
      await this.educationPlatformIntegration.createNotification({
        itemId,
        userId,
        points: Number(points),
        quantity,
        content: {
          cancelation: {
            date: Date.now(),
            reason: OrderCanceledEnum.NOT_ENOUGH_POINTS,
          },
        },
        status: OrderStatusEnum.CANCELED,
      });
      return;
    }
    const status = this.getInitialOrderStatus({
      itemType: ItemTypeEnum[availableItem.type],
      content,
    });
    const [_, order] = await this.prisma.$transaction([
      this.prisma.item.update({
        where: { id: itemId },
        data: { quantity: { decrement: 1 } },
      }),
      this.prisma.order.create({
        data: {
          itemId,
          userId,
          status,
          points: availableItem.points,
          quantity,
          content: content as Record<string, string>,
        },
        include: {
          item: true,
        },
      }),
    ]);
    await this.educationPlatformIntegration.createNotification(order);
    if (availableItem.type === ItemTypeEnum.SERVICE) {
      await this.sqsService.send('sendEmailToCompany', {
        id: v4(),
        body: order,
      });
    }
  }

  public async findById(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException({
        message: `Order with id ${id} not found`,
        errorCode: ErrorCodeEnum.NOT_IN_STOCK,
      });
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
        include: {
          item: true,
        },
      }),
      this.prisma.item.update({
        where: { id: order.itemId },
        data: { quantity: { increment: 1 } },
      }),
    ]);
    await this.educationPlatformIntegration.createNotification(order);
  }

  public async sendEmailToCompany(
    order: Order & {
      item: Item;
    },
  ) {
    const { data: user } = await this.educationPlatformIntegration.getUser({
      userId: order.userId,
    });
    const phoneText = user.phone ? `e telefone ${user.phone}` : '';
    await this.mailerService.sendMail({
      to: order.item.supportEmail,
      from: this.configService.smtpFrom,
      cc: this.configService.smtpFrom,
      subject: 'Usuário deseja seu serviço!',
      text: `O usuário ${user.name} com email ${user.email} ${phoneText} deseja seu serviço de ${order.item.name}. Por favor, entre em contato com ele`,
    });
    const { item, ...rest } = order;
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        ...rest,
        status: OrderStatusEnum.COMPANY_NOTIFIED,
      },
      include: { item: true },
    });
    await this.educationPlatformIntegration.createNotification(updatedOrder);
  }

  private async getUserUsedPoints(userId: string): Promise<number> {
    const orders = await this.repository.getUserUsedPoints(userId);
    return orders.reduce(
      (acc, { quantity, points }) => acc + quantity * points,
      0,
    );
  }

  private getInitialOrderStatus({
    itemType,
    content,
  }: {
    itemType: ItemTypeEnum;
    content: ContentDTO;
  }) {
    if (this.isService(itemType)) {
      return OrderStatusEnum.NOTIFYING_COMPANY;
    }
    if (this.isProduct(itemType)) {
      return this.hasWithdrawalDate(content)
        ? OrderStatusEnum.WAITING_FOR_WITHDRAWAL
        : OrderStatusEnum.SEPARATING;
    }
  }

  private isProduct(itemType: ItemTypeEnum): boolean {
    return itemType === ItemTypeEnum.PRODUCT;
  }

  private isService(itemType: ItemTypeEnum): boolean {
    return itemType === ItemTypeEnum.SERVICE;
  }

  private hasWithdrawalDate(content: ContentDTO): boolean {
    return content.withdrawalDate != null;
  }
}
