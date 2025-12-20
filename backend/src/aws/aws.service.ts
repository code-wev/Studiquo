import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'eu-west-2';
    this.bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || '';
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadStream(key: string, stream: any, contentType?: string) {
    if (!this.bucket) throw new Error('S3 bucket not configured');

    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: stream,
        ContentType: contentType,
      },
      queueSize: 5, // concurrency
      partSize: 1024 * 1024 * 5, // 5MB
    });

    try {
      await parallelUploads3.done();
      return this.getPublicUrl(key);
    } catch (err) {
      this.logger.error('S3 upload failed', err as any);
      throw err;
    }
  }

  async uploadBuffer(key: string, buffer: Buffer, contentType?: string) {
    if (!this.bucket) throw new Error('S3 bucket not configured');

    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      },
      queueSize: 5, // concurrency
      partSize: 1024 * 1024 * 5, // 5MB
    });

    try {
      await parallelUploads3.done();
      return this.getPublicUrl(key);
    } catch (err) {
      this.logger.error('S3 upload failed', err as any);
      throw err;
    }
  }

  getPublicUrl(key: string) {
    if (!this.bucket || !this.region) return '';
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${encodeURIComponent(key)}`;
  }
}
