import { AwsService } from 'src/aws/aws.service';

/**
 * Upload a single file (multer file or data URL) and return { url, key }
 */
export async function uploadSingle(
  awsService: AwsService,
  userId: string,
  file: any,
): Promise<{ url?: string; key?: string } | undefined> {
  if (!file) return undefined;

  // data URL
  if (typeof file === 'string' && file.startsWith('data:')) {
    const matches = file.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return { url: file };
    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = contentType.split('/')[1]?.split('+')[0] || 'png';
    const key = `avatars/${userId}-${Date.now()}.${ext}`;
    const upload = await awsService.uploadBuffer(key, buffer, contentType);
    return { url: upload.url, key: upload.key };
  }

  // multer file (buffer)
  if (file.buffer) {
    const contentType = file.mimetype || 'application/octet-stream';
    const ext = contentType.split('/')[1]?.split('+')[0] || 'png';
    const key = `avatars/${userId}-${Date.now()}.${ext}`;
    const upload = await awsService.uploadBuffer(key, file.buffer, contentType);
    return { url: upload.url, key: upload.key };
  }

  // stream
  if (file.stream) {
    const contentType = file.mimetype || 'application/octet-stream';
    const ext = contentType.split('/')[1]?.split('+')[0] || 'png';
    const key = `avatars/${userId}-${Date.now()}.${ext}`;
    const upload = await awsService.uploadStream(key, file.stream, contentType);
    return { url: upload.url, key: upload.key };
  }

  // fallback: if it's already a URL
  if (typeof file === 'string') return { url: file };

  return undefined;
}

/**
 * Upload multiple files and return array of { url, key }
 */
export async function uploadMultiple(
  awsService: AwsService,
  userId: string,
  files: any[],
) {
  const results: Array<{ url?: string; key?: string }> = [];
  for (const f of files || []) {
    const r = await uploadSingle(awsService, userId, f);
    if (r) results.push(r);
  }
  return results;
}
