#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { RepositoryStack } from '../lib/repository-stack';

const app = new cdk.App();

// stack to define and manages an ECR repository for Docker images
const repoStack = new RepositoryStack(app, 'repoStack', {});
