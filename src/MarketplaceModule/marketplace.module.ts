import * as AWS from 'aws-sdk';
import { HttpModule, Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ItemService } from './service/item.service';
import { ItemController } from './controller/item.controller';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { OrderListener } from './listener/order.listener';
import { ItemRepository } from './repository/item.repository';
import { SecurityIntegration } from './integration/security.integration';
import { EducationPlatformIntegration } from './integration/education-platform.integration';

const SQS = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-2' });

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: 'createOrder',
          queueUrl: process.env.CREATE_ORDER_QUEUE_URL,
          sqs: SQS, // instance of new AWS.SQS
          waitTimeSeconds: 1,
          batchSize: 1,
          terminateVisibilityTimeout: true,
          messageAttributeNames: ['All'],
        },
      ],
      producers: [
        {
          name: 'createOrder',
          queueUrl: process.env.CREATE_ORDER_QUEUE_URL,
          sqs: SQS,
        },
      ],
    }),
    HttpModule,
  ],
  controllers: [ItemController, OrderController],
  providers: [
    ItemService,
    OrderService,
    OrderListener,
    ItemRepository,
    SecurityIntegration,
    EducationPlatformIntegration,
  ],
})
export class MarketplaceModule {}
