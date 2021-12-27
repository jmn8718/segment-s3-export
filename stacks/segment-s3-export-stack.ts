import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { ArnPrincipal, PolicyDocument, PolicyStatement, PrincipalWithConditions, Role } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface IProps extends StackProps {
  readonly segmentWorkspaceId: string;
  readonly segmentPrincipalArn: string;
}

export class SegmentS3ExportStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);
    
    const bucket = new Bucket(this, 'logsBucket');

    const s3PutEventSource = new S3EventSource(bucket, {
      events: [
        EventType.OBJECT_CREATED_PUT
      ]
    });
    
    const segmentS3LogsPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          resources: [`${bucket.bucketArn}/segment-logs/*`],
          actions: [
            's3:PutObject',
            's3:PutObjectAcl'
          ]
        })
      ]
    });

    new Role(this, 'segmentLogsRole', {
      description: 'Allow access to segment to put logs on s3',
      inlinePolicies: {
        s3PutLogs: segmentS3LogsPolicy
      },
      assumedBy: new PrincipalWithConditions(
        new ArnPrincipal(props.segmentPrincipalArn),
        {
          "StringEquals": {
            "sts:ExternalId": props.segmentWorkspaceId
          }
        }
      )
    });

    const handler = new NodejsFunction(this, 'processS3Event', {
      entry: 'functions/processS3Events/handler.ts',
      bundling: {
        minify: true,
        externalModules: ['aws-sdk']
      },
      memorySize: 256,
      timeout: Duration.seconds(15),
      runtime: Runtime.NODEJS_14_X,
      handler: 'default',
      logRetention: RetentionDays.INFINITE,
    });

    handler.addEventSource(s3PutEventSource);
    bucket.grantRead(handler);
  }
}
