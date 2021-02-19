import { Injectable } from '@nestjs/common';
import { OrderService } from '../service/order.service';

@Injectable()
export class OrderListener {
  constructor(private readonly service: OrderService) {}

  public async handleCreateOrderMessage(message: any) {
    await this.service.createOrder('1', '2');
  }
}
