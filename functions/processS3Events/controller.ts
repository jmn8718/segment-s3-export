import type { S3EventRecord } from "aws-lambda";
import { S3 } from 'aws-sdk';
import { uncompress } from "../../libs/file";

const s3 = new S3();

interface SegmentRecord {
  anonymousId: string;
  event: string;
  messageId: string;
  originalTimestamp: string;
  receivedAt: string;
  sentAt: string;
  timestamp: string;
  type: string;
  userId?: string;
  context: {
    ip: string;
    locale: string;
    userAgent: string;
    page: {
      path: string;
      referrer: string;
      search: string;
      title: string;
      url: string;
    };
  }
  properties?: Record<string, any>
  traits?: Record<string, any>
}

export const controller = async (record: S3EventRecord) => {
  try {
    const file = await s3.getObject({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
      VersionId: record.s3.object.versionId
    }).promise();
    if (!file.Body) {
      return;
    }
    // records insile log file
    const records = uncompress<SegmentRecord>(file.Body);
    console.log({ records });
    
    // @todo do whatever you want with the segment records
  } catch (err) {
    console.error(err);
  }
}