import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { type ConfigParameters } from "../../../cdk";

export interface NetworkProps {
  vpc: ConfigParameters["VpcProp"];
}

export class NetworkConstruct extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    /**
     * VPC
     * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html
     */
    this.vpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr(props.vpc.Cidr),
      vpcName: "container-vpc",
      createInternetGateway: true,
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public-ingress",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "public-management",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "private-app",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: "private-db",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Route table
    const publicRouteTable = new ec2.CfnRouteTable(this, "RouteTable", {
      vpcId: this.vpc.vpcId,
    });

    // Route table association
    this.vpc.publicSubnets.forEach((subnet, index) => {
      new ec2.CfnSubnetRouteTableAssociation(
        this,
        `SubnetRouteTableAssociation-${index}`,
        {
          routeTableId: publicRouteTable.ref,
          subnetId: subnet.subnetId,
        }
      );
    });
  }
}
