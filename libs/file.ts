import { Body } from "aws-sdk/clients/s3";
import { gunzipSync } from 'zlib'

export const uncompress = <T = Record<string, any>>(file: Body): T[] => {
  const unzipped = gunzipSync(file as Buffer);
  const content = unzipped.toString();
  return content.split('\n').map((record) => {
    try {
      return JSON.parse(record);
    } catch (err) {
      console.error(err);
    }
    return
  }).filter((record) => !!record) as T[];
}