import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Order } from '@prisma/client';
import { Constants } from '../../CommonsModule/constants';
import { OrderService } from '../service/order.service';
import { InitOrderDTO } from '../dto/init-order.dto';
import { CancelOrderDTO } from '../dto/cancel-order.dto';
import { UserUsedPoints } from '../dto/user-used-points.dto';
import {
  NeedPolicies,
  NeedRoles,
} from '../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('Order')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.ORDER_ENDPOINT}`,
)
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  // @UseGuards(RoleGuard)
  // @NeedRoles('STUDENT')
  // @NeedPolicies(`${Constants.POLICIES_PREFIX}/INIT_CREATE_ORDER`)
  public initCreateOrder(@Body() createOrder: InitOrderDTO): Promise<void> {
    return this.service.initCreateOrder(createOrder);
  }

  @Get('/:id')
  // @UseGuards(RoleGuard)
  // @NeedRoles('STUDENT', 'ADMIN')
  // @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_ORDER_BY_ID`)
  public findById(@Param(':id') id: string): Promise<Order> {
    return this.service.findById(id);
  }

  @Post('/:id/cancel')
  // @UseGuards(RoleGuard)
  // @NeedRoles('ADMIN')
  // @NeedPolicies(`${Constants.POLICIES_PREFIX}/CANCEL_ORDER`)
  public cancelOrder(
    @Param('id') id: string,
    @Body() { reason }: CancelOrderDTO,
  ): Promise<void> {
    return this.service.cancelOrder({ id, reason });
  }

  @Get('/user/:userId')
  // @UseGuards(RoleGuard)
  // @NeedRoles('ADMIN', 'STUDENT')
  // @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_ORDER_BY_USER_ID`)
  public getByUserId(@Param('userId') id: string): Promise<Order[]> {
    return this.service.getByUserId(id);
  }

  @Get('/user/:userId/used-points')
  // @UseGuards(RoleGuard)
  // @NeedRoles('ADMIN', 'STUDENT')
  // @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_USER_USED_POINTS`)
  public async getUserUsedPoints(
    @Param('userId') id: string,
  ): Promise<UserUsedPoints> {
    return { usedPoints: await this.service.getUserUsedPoints(id) };
  }
}
