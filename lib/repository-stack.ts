import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

import { PREFIX, REPOSITORY_NAME } from './parameters';

// stack to define and manages an ECR repository for Docker images
export class RepositoryStack extends cdk.Stack {
  public repository: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props); // property to hold a reference to the ECR repository that will be created

    const repositoryName = `${PREFIX}-${REPOSITORY_NAME}`;

    this.repository = new ecr.Repository(this, 'Repository', {
      repositoryName,
      imageScanOnPush: true, // enable scanning for vulnerabilities on image push.
      emptyOnDelete: true, // deleting the repository force deletes the contents of the repository.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // repository is deleted when the stack is removed.
    });
  }
}
