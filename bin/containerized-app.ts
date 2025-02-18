#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { ContainerizedAppStack } from '../lib/containerized-app-stack';
import { RepositoryStack } from '../lib/repository-stack';

const app = new cdk.App();

// stack to define and manages an ECR repository for Docker images.
const repoStack = new RepositoryStack(app, 'RepoStack', {});

// stack to manage networking, ECS service, scaling, and API Gateway.
new ContainerizedAppStack(app, 'ContainerizedAppStack', {
  repository: repoStack.repository, // pass the ECR repository info to the ContainerizedAppStack
});
