import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  public getUserUsedPoints(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
    });
  }
}
