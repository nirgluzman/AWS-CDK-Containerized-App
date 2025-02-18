# Deploying a Containerized NodeJs Application using AWS CDK, AWS ECR, ECS (Fargate) and Docker

## GitHub repo

https://github.com/nirgluzman/AWS-CDK-Containerized-App.git

## Architecture

![](./docs/images/architecture.png)

## Project setup

### Initialize a new CDK project:

```bash
cdk init app --language=typescript
```

### Project structure:

```tree
containerized-app
├── bin
│   └── containerized-app.ts
├── lib
│   └── containerized-app-stack.ts
├── package.json
├── tsconfig.json
└── README.md
```

- `bin/`: Contains the entry point for our CDK app.
- `lib/`: This is where we define our cloud resources.
- `package.json`: Lists dependencies for our application (for TypeScript).
- `cdk.json`: Configuration for our CDK app.

## Pushing a Docker image to an Amazon ECR private repository

https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html

1. Authenticate Docker client to the Amazon ECR registry to which you intend to push your image.

```bash
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

2. Tag the image with the Amazon ECR registry, repository, and optional image tag name combination
   to use.

```bash
docker tag my-node-app <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPOSITORY_NAME>
```

3. Push the image using the `docker push` command:

```bash
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPOSITORY_NAME>
```

4. (Optional) Apply any additional tags to the image and push those tags to Amazon ECR.
