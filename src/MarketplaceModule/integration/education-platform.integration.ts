import { HttpService, Injectable } from '@nestjs/common';
import { Order, Item } from '@prisma/client';
import { AxiosResponse } from 'axios';
import { SecurityIntegration } from './security.integration';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { RankingDTO } from '../dto/ranking.dto';
import { UserDTO } from '../dto/user.dto';
import { TimeRangeEnum } from '../enum/time-range.enum';

@Injectable()
export class EducationPlatformIntegration {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly securityIntegration: SecurityIntegration,
  ) {}

  public async getUserRanking(
    userId: string,
  ): Promise<AxiosResponse<RankingDTO>> {
    const accessToken: string = await this.securityIntegration.getAccessToken();
    const headers = {
      authorization: `Bearer ${accessToken}`,
    };
    return await this.http
      .get<RankingDTO>(
        this.config.getEducationPlatformGetUserRankingUrl(userId),
        {
          headers,
          params: {
            timeRange: TimeRangeEnum.YEAR,
          },
        },
      )
      .toPromise();
  }

  public async getUser({
    userId,
  }: {
    userId: string;
  }): Promise<AxiosResponse<UserDTO>> {
    const accessToken: string = await this.securityIntegration.getAccessToken();
    const headers = {
      authorization: `Bearer ${accessToken}`,
    };
    return await this.http
      .get<UserDTO>(this.config.getEducationPlatformGetUserUrl(userId), {
        headers,
      })
      .toPromise();
  }

  public async createNotification(
    params: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> & { item?: Item },
  ): Promise<void> {
    const accessToken: string = await this.securityIntegration.getAccessToken();
    const body: CreateNotificationDTO = {
      content: { ...params, ...(params.content as any) },
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
