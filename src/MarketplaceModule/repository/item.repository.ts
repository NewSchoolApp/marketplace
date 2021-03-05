import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../PrismaModule/service/prisma.service';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  public findAvailableById(id: string) {
    return this.prisma.item.findFirst({ where: { id, quantity: { gt: 0 } } });
  }
}
