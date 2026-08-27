import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '3a2f834554bac72ffd41a784adaa8a52';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || 'd7b9df9a0f58418f08df710c09fab9b8';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '5d07e34cd88eaf4094a814f8081dcd407ec37465ecfcad02a3011ec8548b6100';
export const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'madbespoke-media';
const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;
const publicDomain = process.env.R2_PUBLIC_DOMAIN || '';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Ensure bucket exists on startup
export async function initR2Bucket() {
  try {
    await r2Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`[Cloudflare R2] Connected to bucket: "${BUCKET_NAME}"`);
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      try {
        console.log(`[Cloudflare R2] Creating bucket: "${BUCKET_NAME}"...`);
        await r2Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`[Cloudflare R2] Bucket "${BUCKET_NAME}" created successfully.`);
      } catch (createErr) {
        console.warn('[Cloudflare R2] Bucket check/create note:', createErr.message);
      }
    } else {
      console.log(`[Cloudflare R2] Initialized with endpoint ${endpoint} (Bucket: ${BUCKET_NAME})`);
    }
  }
}

/**
 * Upload a file directly to Cloudflare R2
 */
export async function uploadToR2(buffer, key, contentType = 'image/jpeg') {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // If a public custom domain is configured, use it. Otherwise serve through the API media proxy.
  if (publicDomain) {
    return `${publicDomain.replace(/\/$/, '')}/${key}`;
  }
  
  // API media proxy URL (ensures images load seamlessly without exposing credentials)
  return `/api/media/${key}`;
}

/**
 * Generate a presigned upload URL for direct browser-to-R2 upload
 */
export async function generatePresignedUploadUrl(key, contentType = 'image/jpeg', expiresIn = 900) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  
  const publicUrl = publicDomain ? `${publicDomain.replace(/\/$/, '')}/${key}` : `/api/media/${key}`;

  return {
    uploadUrl,
    key,
    publicUrl,
    expiresIn,
  };
}

/**
 * Retrieve an object from R2 as a stream for proxying
 */
export async function getObjectFromR2(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await r2Client.send(command);
}
