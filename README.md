# segment-s3-export

This project configures using aws-cdk the resources on AWS needed to export the events from [segment](https://segment.com/) to an aws s3 bucket, as it is indicated on segment [documentation](https://segment.com/docs/connections/storage/catalog/aws-s3/).

You can read about this project on this [post](https://medium.com/@jmn8718/export-segment-logs-to-aws-s3-with-aws-cdk-f679d6b2b3a1)

## requirements

- AWS account
- aws-cli (install and configured)
- Segment Account

## Useful commands

 * `yarn bootstrap`     bootstrap the aws-cdk project (only the first time).
 * `yarn deploy --all`  deploy all the stacks 
 * `yarn deploy xxx`    deploy the stacks that match the regular expression *xxx*
 * `yarn destroy --all` destroy all the stacks 
 * `yarn destroy xxx`   destroy the stack xxx and its dependencies
 * `npm run build`      compile typescript to js
 * `cdk deploy`         deploy this stack to your default AWS account/region
 * `cdk diff`           compare deployed stack with current state
 * `cdk synth`          emits the synthesized CloudFormation template
