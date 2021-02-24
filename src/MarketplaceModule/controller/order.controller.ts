import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Order } from '@prisma/client';
import { Constants } from '../../CommonsModule/constants';
import { OrderService } from '../service/order.service';
import { InitOrderDTO } from '../dto/init-order.dto';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.ORDER_ENDPOINT}`,
)
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  public async initCreateOrder(
    @Body() createOrder: InitOrderDTO,
  ): Promise<void> {
    return this.service.initCreateOrder(createOrder);
  }

  @Get('/:id')
  public async findById(@Param(':id') id: string): Promise<Order> {
    return this.service.findById(id);
  }

  @Get('/user/:userId')
  public async getByUserId(@Param(':userId') id: string): Promise<Order[]> {
    return this.service.getByUserId(id);
  }
}
