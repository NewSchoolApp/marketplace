import * as fs from 'fs';
import { AWSError, S3 } from 'aws-sdk';
import { promisify } from 'util';
import { Response } from 'express';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class UploadService implements OnModuleInit {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.s3 = new S3(this.configService.getAwsConfiguration());
  }

  public async uploadItemPhoto(
    filePath: string,
    fileBuffer: Buffer,
  ): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> {
    const params: S3.PutObjectRequest = {
      Bucket: this.configService.awsUserBucket,
      Key: filePath,
      Body: fileBuffer,
    };
    return this.s3.putObject(params).promise();
  }

  public async getItemPhoto(filePath: string): Promise<string> {
    const params: S3.GetObjectRequest = {
      Bucket: this.configService.awsUserBucket,
      Key: filePath,
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }
}
