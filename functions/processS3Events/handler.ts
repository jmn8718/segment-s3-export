import type { S3Event } from 'aws-lambda';
import { controller } from './controller';

const handler = async ( event: S3Event ): Promise<void> => {
  await Promise.all(event.Records.map(controller));
}

export default handler;