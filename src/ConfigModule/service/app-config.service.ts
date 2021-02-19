import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  securityOauthTokenDetailsUrl: string = this.configService.get<string>(
    'SECURITY_OAUTH_TOKEN_DETAILS_URL',
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
    };
  }
}
