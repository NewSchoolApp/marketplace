import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { PrismaModule } from './PrismaModule/prisma.module';
import { ConfigModule } from './ConfigModule/config.module';
import { MarketplaceModule } from './MarketplaceModule/marketplace.module';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    RavenModule,
    PrismaModule,
    ConfigModule,
    MarketplaceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
})
export class AppModule {}
