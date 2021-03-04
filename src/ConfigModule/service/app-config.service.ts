import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  securityOauthTokenUrl: string = this.configService.get<string>(
    'SECURITY_OAUTH_TOKEN_URL',
  );

  securityOauthTokenDetailsUrl: string = this.configService.get<string>(
    'SECURITY_OAUTH_TOKEN_DETAILS_URL',
  );

  private securityClientCredentialsName: string = this.configService.get<string>(
    'SECURITY_CLIENT_CREDENTIALS_NAME',
  );

  private securityClientCredentialsSecret: string = this.configService.get<string>(
    'SECURITY_CLIENT_CREDENTIALS_SECRET',
  );

  // url example: http://localhost:8080/api/v1/notification/user/:userId
  educationPlatformCreateNotificationUrl: string = this.configService.get<string>(
    'EDUCATION_PLATFORM_CREATE_NOTIFICATION_URL',
  );

  nodeEnv: string = this.configService.get<string>('NODE_ENV');
  port: number = this.configService.get<number>('PORT');

  sentryUrl: string = this.configService.get<string>('SENTRY_URL');

  public getSentryConfiguration(): Sentry.NodeOptions {
    return {
      dsn: this.sentryUrl,
      tracesSampleRate: 1.0,
      enabled: this.nodeEnv !== 'TEST',
      environment: this.nodeEnv,
      attachStacktrace: true,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Mysql() as any,
      ],
    };
  }

  getEducationPlatformCreateNotificationUrl(userId: string) {
    return this.educationPlatformCreateNotificationUrl.replace(
      ':userId',
      userId,
    );
  }

  getClientCredentialsBase64() {
    const joinedUpClientCredentials = `${this.securityClientCredentialsName}:${this.securityClientCredentialsSecret}`;
    return Buffer.from(joinedUpClientCredentials).toString('base64');
  }
}
