import { HttpService, Injectable } from '@nestjs/common';
import { SecurityIntegration } from './security.integration';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { OrderCanceledEnum } from '../enum/order-canceled.enum';

@Injectable()
export class EducationPlatformIntegration {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly securityIntegration: SecurityIntegration,
  ) {}

  public async createNotification(params: {
    itemId: string;
    userId: string;
    status: OrderStatusEnum;
    description?: OrderCanceledEnum;
  }) {
    const accessToken: string = await this.securityIntegration.getAccessToken();
    const body: CreateNotificationDTO = {
      content: params,
      important: false,
      type: NotificationTypeEnum.MARKETPLACE,
    };
    const headers = {
      authorization: `Bearer ${accessToken}`,
    };
    await this.http
      .post(
        this.config.getEducationPlatformCreateNotificationUrl(params.userId),
        body,
        { headers },
      )
      .toPromise();
  }
}
