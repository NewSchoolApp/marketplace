import { Module } from '@nestjs/common';
import { PrismaModule } from './PrismaModule/prisma.module';
import { MarketplaceModule } from './MarketplaceModule/marketplace.module';

@Module({
  imports: [PrismaModule, MarketplaceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
