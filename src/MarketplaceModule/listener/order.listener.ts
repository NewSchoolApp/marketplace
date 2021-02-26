import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { OrderService } from '../service/order.service';
import { CreateOrderQueuePayloadDTO } from '../dto/create-order-queue-payload.dto';

@Injectable()
export class OrderListener {
  constructor(private readonly service: OrderService) {}

  @SqsMessageHandler('createOrder', false)
  public async handleCreateOrderMessage(message: AWS.SQS.Message) {
    const payload: CreateOrderQueuePayloadDTO = JSON.parse(message.Body);
    await this.service.createOrder(payload);
  }
}
