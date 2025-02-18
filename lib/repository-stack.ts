import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

// stack to define and manages an ECR repository for Docker images
export class RepositoryStack extends cdk.Stack {
  repository: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props); // property to hold a reference to the ECR repository that will be created

    const repository = new ecr.Repository(this, 'Repository', {
      repositoryName: `nodejs-app-repository`,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // repository is deleted when the stack is removed
    });
    this.repository = repository;
  }
}

// stack to manage networking, ECS services, scaling, and API Gateway
export class ContainerizedAppStack extends cdk.Stack {}
