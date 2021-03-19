import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { S3 } from 'aws-sdk';

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

  awsAccessKey: string = this.configService.get<string>('AWS_ACCESS_KEY');
  awsAccessKeySecret: string = this.configService.get<string>(
    'AWS_ACCESS_KEY_SECRET',
  );
  awsS3MarketplaceBucketHttpsUrl: string = this.configService.get<string>(
    'AWS_S3_MARKETPLACE_BUCKET_HTTPS_URL',
  );
  awsBucketEndpoint: string = this.configService.get<string>(
    'AWS_BUCKET_ENDPOINT',
  );
  awsUserBucket: string = this.configService.get<string>('AWS_USER_BUCKET');

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
    };
  }

  getAwsConfiguration(): S3.Types.ClientConfiguration {
    return {
      accessKeyId: this.awsAccessKey,
      secretAccessKey: this.awsAccessKeySecret,
      region: 'us-east-2',
      signatureVersion: 'v4',
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

  getAwsS3MarketplaceBucketHttpsUrl(sufix: string) {
    return `${this.awsS3MarketplaceBucketHttpsUrl}${sufix}`;
  }
}
