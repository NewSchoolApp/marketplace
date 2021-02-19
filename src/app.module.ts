import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { PrismaModule } from './PrismaModule/prisma.module';
import { ConfigModule } from './ConfigModule/config.module';
import { MarketplaceModule } from './MarketplaceModule/marketplace.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ConfigModule,
    MarketplaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
