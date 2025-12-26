import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';

/**
 * AwsService
 *
 * Centralized service responsible for uploading files to Amazon S3.
 * This service ONLY supports stream-based uploads for maximum
 * memory efficiency and scalability.
 *
 * Best suited for:
 * - Large file uploads (videos, audio, PDFs)
 * - High concurrency systems
 * - Streaming uploads (multipart upload)
 */
@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  /**
   * Initializes the AWS S3 client using environment variables.
   *
   * Required environment variables:
   * - AWS_REGION
   * - AWS_ACCESS_KEY_ID
   * - AWS_SECRET_ACCESS_KEY
   * - S3_BUCKET or AWS_S3_BUCKET
   */
  constructor() {
    this.region = process.env.AWS_REGION || 'eu-north-1';
    this.bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || '';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  /**
   * Upload multiple streams to Amazon S3 in parallel.
   *
   * Each item must include:
   * - key: unique S3 object key
   * - stream: readable stream
   * - contentType: optional MIME type
   *
   * @param files - array of stream upload definitions
   * @returns array of upload results in the same order
   */
  async uploadMultiple(
    files: Array<{
      key: string;
      stream: Readable;
      contentType?: string;
    }>,
  ) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    if (!files?.length) return [];

    const tasks = files.map((file) =>
      this.uploadStream(file.key, file.stream, file.contentType),
    );

    return Promise.all(tasks);
  }

  /**
   * Uploads a readable stream to Amazon S3 using multipart upload.
   *
   * This is the ONLY supported upload method.
   * Designed to handle large files efficiently.
   *
   * Multipart upload details:
   * - Uploads file in 5MB chunks
   * - Uploads up to 5 parts concurrently
   * - Automatically retries failed parts
   *
   * @param key - Unique S3 object key (path/filename)
   * @param stream - Readable stream (fs, multer, HTTP, etc.)
   * @param contentType - Optional MIME type (e.g. "application/pdf")
   *
   * @returns Object containing:
   * - message: upload status message
   * - url: public S3 file URL
   * - key: uploaded S3 object key
   *
   * @throws Error if upload fails or bucket is missing
   */
  async uploadStream(key: string, stream: Readable, contentType?: string) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: stream,
        ContentType: contentType,
      },
      queueSize: 5, // concurrent parts
      partSize: 1024 * 1024 * 5, // 5MB per part
      leavePartsOnError: false,
    });

    try {
      await upload.done();

      return {
        message: 'File uploaded successfully',
        key,
        url: this.getPublicUrl(key),
      };
    } catch (error: unknown) {
      this.logger.error(`S3 stream upload failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Generates a public URL for an S3 object.
   *
   * NOTE:
   * - Works only if bucket/object is public
   * - For private buckets, use CloudFront or signed URLs
   *
   * @param key - S3 object key
   * @returns Publicly accessible S3 URL
   */
  getPublicUrl(key: string): string {
    if (!this.bucket || !this.region) return '';

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${encodeURIComponent(
      key,
    )}`;
  }

  /**
   * Delete a single object from S3 by key.
   *
   * @param key - S3 object key
   */
  async deleteObject(key: string) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      return { message: 'Deleted', key };
    } catch (error: unknown) {
      this.logger.error(`S3 deleteObject failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Delete multiple objects from S3 in a single request.
   *
   * @param keys - array of S3 object keys
   */
  async deleteObjects(keys: string[]) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    if (!keys?.length) return { deleted: [] };

    try {
      const response = await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: keys.map((key) => ({ Key: key })),
          },
        }),
      );

      return { message: 'Batch delete completed', response };
    } catch (error: unknown) {
      this.logger.error('S3 deleteObjects failed', error);
      throw error;
    }
  }
}
