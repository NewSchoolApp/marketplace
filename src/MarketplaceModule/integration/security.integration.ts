import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { GeneratedTokenDTO } from '../dto/generated-token.dto';

@Injectable()
export class SecurityIntegration {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  public async getAccessToken(): Promise<string> {
    const clientCredentialsBase64 = this.config.getClientCredentialsBase64();
    const headers = {
      Authorization: `Basic ${clientCredentialsBase64}`,
    };
    const body = {
      grant_type: 'client_credentials',
    };
    const {
      data: { accessToken },
    } = await this.http
      .post<GeneratedTokenDTO>(this.config.securityOauthTokenUrl, body, {
        headers,
      })
      .toPromise();
    return accessToken;
  }
}
