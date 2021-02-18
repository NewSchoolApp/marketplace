import { PrismaService } from '../../PrismaModule/service/prisma.service';

export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}
}
