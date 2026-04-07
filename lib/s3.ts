import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCESS_KEY_ID =
  process.env.ACCESS_KEY?.trim() ||
  process.env.AWS_ACCESS_KEY_ID?.trim() ||
  "";
const SECRET_ACCESS_KEY =
  process.env.SECRET_ACCESS_KEY?.trim() ||
  process.env.AWS_SECRET_ACCESS_KEY?.trim() ||
  "";
const AWS_REGION = process.env.AWS_REGION?.trim() || "";
const S3_BUCKET =
  process.env.S3_BUCKET?.trim() || process.env.AWS_S3_BUCKET?.trim() || "";
const S3_PREFIX = (process.env.S3_PREFIX?.trim() || "uploads/evidence").replace(
  /^\/+|\/+$/g,
  ""
);
const SIGNED_URL_TTL_SECONDS = 60 * 10;

let s3Client: S3Client | null = null;

export type StoredEvidenceRef = string;

export function isS3Configured() {
  return Boolean(ACCESS_KEY_ID && SECRET_ACCESS_KEY && AWS_REGION && S3_BUCKET);
}

function getS3Client() {
  if (!isS3Configured()) {
    throw new Error("S3 is not configured");
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
  }

  return s3Client;
}

function sanitizeFilename(filename: string) {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return cleaned || "file";
}

function getEvidenceKey(filename: string) {
  const safeName = sanitizeFilename(filename);
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return `${S3_PREFIX}/${unique}_${safeName}`;
}

function toStoredRef(key: string) {
  return `s3://${S3_BUCKET}/${key}`;
}

function parseStoredRef(value: string) {
  const match = /^s3:\/\/([^/]+)\/(.+)$/.exec(value);
  if (!match) return null;
  return { bucket: match[1], key: match[2] };
}

export function isStoredS3Ref(value: string) {
  return value.startsWith("s3://");
}

export async function uploadEvidenceToS3(params: {
  body: Buffer;
  contentType?: string;
  filename: string;
}) {
  const client = getS3Client();
  const key = getEvidenceKey(params.filename);

  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: params.body,
      ContentType: params.contentType,
    })
  );

  return {
    key,
    bucket: S3_BUCKET,
    storedRef: toStoredRef(key),
  };
}

export async function resolveStoredFileUrl(value: string) {
  if (!value) return value;
  if (value.startsWith("data:")) return value;
  if (!isStoredS3Ref(value)) return value;

  const parsed = parseStoredRef(value);
  if (!parsed) return value;

  const client = getS3Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: parsed.bucket,
      Key: parsed.key,
    }),
    { expiresIn: SIGNED_URL_TTL_SECONDS }
  );
}

export async function resolveStoredFileUrls(values?: string[]) {
  if (!values?.length) return [];
  return Promise.all(values.map((value) => resolveStoredFileUrl(value)));
}
