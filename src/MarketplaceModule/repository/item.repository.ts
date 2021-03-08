import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../PrismaModule/service/prisma.service';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  public findById(id: string) {
    return this.prisma.item.findUnique({ where: { id } });
  }

  public findAvailableById({ id, minQuantity }: { id; minQuantity }) {
    return this.prisma.item.findFirst({
      where: { id, quantity: { gte: minQuantity } },
    });
  }
}
