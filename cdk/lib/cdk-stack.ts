import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import type { Construct } from "constructs";
import type { ConfigParameters, getSystemConfig } from "../cdk";
import { NetworkConstruct } from "./resource/network/network";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  readonly config: ConfigParameters;

  constructor(
    scope: Construct,
    id: string,
    config: ConfigParameters,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);
    this.config = config;

    // Network
    new NetworkConstruct(this, "NetworkConstruct", {
      vpc: this.config.VpcProp,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
