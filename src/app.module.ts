import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { PrismaModule } from './PrismaModule/prisma.module';
import { ConfigModule } from './ConfigModule/config.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';
import { MarketplaceModule } from './MarketplaceModule/marketplace.module';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';

const mailerAsyncModule: MailerAsyncOptions = {
  useFactory: (appConfigService: ConfigService) =>
    appConfigService.getSmtpConfiguration(),
  imports: [ConfigModule],
  inject: [ConfigService],
};

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    // MailerModule.forRootAsync(mailerAsyncModule),
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
