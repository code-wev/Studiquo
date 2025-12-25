import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, Logger } from '@nestjs/common';

/**
 * AwsService
 *
 * Centralized service responsible for uploading files to Amazon S3.
 * Supports both Buffer-based and Stream-based uploads using multipart upload.
 *
 * Best suited for:
 * - Large file uploads (videos, PDFs, archives)
 * - High-concurrency systems
 * - Memory-efficient streaming uploads
 */
@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

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
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Upload multiple files to S3. Each item should contain a unique `key`
   * and either a `buffer` or a `stream`, plus optional `contentType`.
   * Returns an array of upload results in the same order.
   */
  async uploadMultiple(
    files: Array<{
      key: string;
      buffer?: Buffer;
      stream?: any;
      contentType?: string;
    }>,
  ) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    if (!files || files.length === 0) return [];

    const tasks = files.map((f) => {
      if (f.buffer) return this.uploadBuffer(f.key, f.buffer, f.contentType);
      if (f.stream) return this.uploadStream(f.key, f.stream, f.contentType);
      return Promise.reject(
        new Error('Each file must include buffer or stream'),
      );
    });

    // Run uploads in parallel and propagate errors.
    return Promise.all(tasks);
  }

  /**
   * Uploads a readable stream to Amazon S3 using multipart upload.
   *
   * This method is memory-efficient and recommended for large files
   * such as videos, large images, or archives.
   *
   * Multipart upload details:
   * - Uploads file in 5MB chunks
   * - Uploads up to 5 parts concurrently
   * - Automatically retries failed parts
   *
   * @param key - Unique S3 object key (path/filename)
   * @param stream - Readable stream (fs.createReadStream, HTTP stream, etc.)
   * @param contentType - Optional MIME type (e.g. "image/png")
   *
   * @returns Object containing:
   * - message: upload status message
   * - url: public S3 file URL
   * - key: uploaded S3 object key
   *
   * @throws Error if S3 bucket is not configured or upload fails
   */
  async uploadStream(key: string, stream: any, contentType?: string) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: stream,
        ContentType: contentType,
      },
      queueSize: 5, // Number of concurrent upload parts
      partSize: 1024 * 1024 * 5, // 5MB per part
    });

    try {
      await parallelUploads3.done();

      return {
        message: 'File uploaded successfully',
        url: this.getPublicUrl(key),
        key,
      };
    } catch (err: unknown) {
      this.logger.error('S3 stream upload failed', err);
      throw err;
    }
  }

  /**
   * Uploads a Buffer to Amazon S3 using multipart upload.
   *
   * This method loads the entire file into memory first, so it is
   * best suited for small to medium-sized files (e.g. profile images,
   * thumbnails, generated PDFs).
   *
   * Multipart upload details:
   * - Uploads buffer in 5MB chunks
   * - Uploads up to 5 parts concurrently
   * - Automatically retries failed parts
   *
   * @param key - Unique S3 object key (path/filename)
   * @param buffer - File data stored in memory as Buffer
   * @param contentType - Optional MIME type (e.g. "application/pdf")
   *
   * @returns Object containing:
   * - message: upload status message
   * - url: public S3 file URL
   * - key: uploaded S3 object key
   *
   * @throws Error if S3 bucket is not configured or upload fails
   */
  async uploadBuffer(key: string, buffer: Buffer, contentType?: string) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      },
      queueSize: 5, // Number of concurrent upload parts
      partSize: 1024 * 1024 * 5, // 5MB per part
    });

    try {
      await parallelUploads3.done();

      return {
        message: 'File uploaded successfully',
        url: this.getPublicUrl(key),
        key,
      };
    } catch (err: unknown) {
      this.logger.error('S3 buffer upload failed', err);
      throw err;
    }
  }

  /**
   * Generates a public URL for an S3 object.
   *
   * NOTE:
   * - This works only if the bucket/object is publicly accessible
   * - For private buckets, use CloudFront or presigned GET URLs
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
   * @param key - S3 object key to delete
   */
  async deleteObject(key: string) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return { message: 'Deleted', key };
    } catch (err: unknown) {
      this.logger.error('S3 deleteObject failed', err);
      throw err;
    }
  }

  /**
   * Delete multiple objects from S3 by keys.
   * @param keys - array of S3 object keys to delete
   */
  async deleteObjects(keys: string[]) {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }
    if (!keys || keys.length === 0) return { deleted: [] };

    try {
      const resp = await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: { Objects: keys.map((k) => ({ Key: k })) },
        }),
      );
      return { message: 'Batch delete complete', resp };
    } catch (err: unknown) {
      this.logger.error('S3 deleteObjects failed', err);
      throw err;
    }
  }
}
