import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  // CreateBucketCommand,
} from '@aws-sdk/client-s3';
import config from '../config';

const { bucket, ...configS3 } = config.s3;
export const s3 = new S3Client(configS3);

// s3.send(new CreateBucketCommand({ Bucket: bucket }));

export default {
  list: async (path) => s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: path, Delimiter: '/' })),
  put: async (key, buffer, mimetype) => s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: mimetype })),
  get: async (key) => s3.send(new GetObjectCommand({ Bucket: bucket, Key: key })),
  delete: async (key) => s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key })),
};
