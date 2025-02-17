# Deploying a Containerized NodeJs Application using AWS CDK, AWS ECR, ECS (Fargate) and Docker

### GitHub repo:

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
