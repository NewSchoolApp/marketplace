import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderCanceledEnum } from '../enum/order-canceled.enum';

export class CancelOrderDTO {
  @IsEnum(OrderCanceledEnum)
  @IsNotEmpty()
  reason: OrderCanceledEnum;
}
