import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import path from 'path';

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

  // url example: http://localhost:8080/api/v1/gamification/ranking/user/:userId
  educationPlatformGetUserRankingUrl: string = this.configService.get<string>(
    'EDUCATION_PLATFORM_GET_USER_RANKING_URL',
  );

  // url example: http://localhost:8080/api/v1/user/:userId
  educationPlatformGetUserUrl: string = this.configService.get<string>(
    'EDUCATION_PLATFORM_GET_USER_URL',
  );

  nodeEnv: string = this.configService.get<string>('NODE_ENV');
  port: number = this.configService.get<number>('PORT');

  sentryUrl: string = this.configService.get<string>('SENTRY_URL');

  smtpHost: string = this.configService.get<string>('SMTP_HOST');
  smtpPort: number = this.configService.get<number>('SMTP_PORT');
  smtpSecure?: boolean = this.configService.get<boolean>('SMTP_SECURE');
  smtpRequireTls: boolean = this.configService.get<boolean>('SMTP_REQUIRE_TLS');
  smtpUser: string = this.configService.get<string>('SMTP_USER');
  smtpPassword: string = this.configService.get<string>('SMTP_PASSWORD');
  smtpFrom: string = this.configService.get<string>('SMTP_FROM');

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

  public getSmtpConfiguration(): MailerOptions {
    return {
      transport: {
        host: this.smtpHost,
        port: this.smtpPort,
        secure: this.smtpSecure,
        requireTLS: this.smtpRequireTls,
        auth: {
          user: this.smtpUser,
          pass: this.smtpPassword,
        },
      },
      template: {
        dir: path.resolve(path.join(__dirname, '..', '..')) + '/../templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    };
  }

  getEducationPlatformCreateNotificationUrl(userId: string): string {
    return this.educationPlatformCreateNotificationUrl.replace(
      ':userId',
      userId,
    );
  }

  getEducationPlatformGetUserRankingUrl(userId: string): string {
    return this.educationPlatformGetUserRankingUrl.replace(':userId', userId);
  }

  getEducationPlatformGetUserUrl(userId: string): string {
    return this.educationPlatformGetUserRankingUrl.replace(':userId', userId);
  }

  getClientCredentialsBase64() {
    const joinedUpClientCredentials = `${this.securityClientCredentialsName}:${this.securityClientCredentialsSecret}`;
    return Buffer.from(joinedUpClientCredentials).toString('base64');
  }
}
