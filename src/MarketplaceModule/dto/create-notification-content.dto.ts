import { OrderStatusEnum } from '../enum/order-status.enum';

export class CreateNotificationContentDTO {
  itemId: string;
  userId: string;
  status: OrderStatusEnum;
}
