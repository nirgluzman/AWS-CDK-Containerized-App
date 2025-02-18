import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as apigw2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpAlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

import { PREFIX, CONTAINER_PORT } from './parameters';

interface ContainerizedAppStackProps extends cdk.StackProps {
  repository: ecr.Repository;
}

// stack to manage networking, ECS service, scaling, and API Gateway.
export class ContainerizedAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ContainerizedAppStackProps) {
    super(scope, id, props);

    // use the passed-in repository
    const ecrRepository = props.repository;

    // AWS VPC (Virtual Private Cloud)
    // Without explicitly defining subnetConfiguration, the CDK will create two subnets per AZ: one public and one private !
    const vpc = new ec2.Vpc(this, 'EdaVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'), // IP address range.
      maxAzs: 2, // limits the VPC to two availability zones.
      vpcName: `${PREFIX}-vpc`,
      restrictDefaultSecurityGroup: false, // if set to true then the default inbound & outbound rules will be removed from the default security group.
    });

    // ECS cluster
    const cluster = new ecs.Cluster(this, 'EdaCluster', {
      clusterName: `${PREFIX}-cluster`,
      containerInsights: true, // enables CloudWatch Container Insights for the ECS cluster.
      vpc, // specifies the VPC where the ECS cluster will be deployed.
    });

    // Fargate service that is fronted by an ALB (Application Load Balancer).
    // publicLoadBalancer -> ALB will be created in the public subnets of the VPC.
    // Fargate tasks -> placed in the private subnets of the VPC by default (security best practice).
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'EdaFargateService',
      {
        cluster,
        cpu: 256, // number of cpu units used by the task.
        serviceName: `${PREFIX}-service`,
        loadBalancerName: `${PREFIX}-alb-ecs`,
        desiredCount: 2, // desired number of instantiations of the task definition to keep running on the service.
        taskImageOptions: {
          // properties required to create a new task definition.
          image: ecs.ContainerImage.fromEcrRepository(ecrRepository, 'latest'),
          environment: {
            // environment variables inside the container.
            ENV_VAR_1: 'value1',
            ENV_VAR_2: 'value2',
          },
          containerPort: CONTAINER_PORT, // specifies the port exposed by the container.
        },
        memoryLimitMiB: 512, // amount (in MiB) of memory used by the task.
        publicLoadBalancer: true, // controls the ALB's placement (public subnets) and its public accessibility.
      }
    );

    // ensure that instances are operational before they are marked as healthy in the load balancer.
    service.targetGroup.configureHealthCheck({
      path: '/', // specifies the health check endpoint as `"/"`, which means it will check the root of the application.
    });

    // HTTP API
    const httpApi = new apigw2.HttpApi(this, 'HttpApi', { apiName: `${PREFIX}-api` });

    // connect the API to the load balancer.
    httpApi.addRoutes({
      path: '/',
      methods: [
        apigw2.HttpMethod.GET, // allows GET requests on this route.
      ],
      integration: new HttpAlbIntegration('AlbIntegration', service.listener), // links the route to the load balancer, directing incoming API requests to the ECS service.
    });
  }
}
