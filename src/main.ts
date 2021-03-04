import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const appConfigService = app.get<ConfigService>(ConfigService);
  Sentry.init(appConfigService.getSentryConfiguration());
  const options = new DocumentBuilder()
    .setTitle('@Marketplace/marketplace')
    .setDescription('Backend do Marketplace da NewSchool')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
