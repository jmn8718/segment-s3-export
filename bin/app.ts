#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SegmentS3ExportStack } from '../stacks/segment-s3-export-stack';

const app = new cdk.App();

const {
  segmentPrincipalArn,
  segmentWorkspaceId,
}: {
  segmentPrincipalArn: string;
  segmentWorkspaceId: string;
} = {
  segmentPrincipalArn: app.node.tryGetContext('segmentPrincipalArn'),
  segmentWorkspaceId: app.node.tryGetContext('segmentWorkspaceId'),
}
new SegmentS3ExportStack(app, 'SegmentS3ExportStack', {
  segmentPrincipalArn,
  segmentWorkspaceId,
});