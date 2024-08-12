import * as amplify from "@aws-cdk/aws-amplify-alpha"

import { Construct } from "constructs"
import { CfnOutput, SecretValue, Stack, StackProps } from "aws-cdk-lib"
import { BuildSpec } from "aws-cdk-lib/aws-codebuild"
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { CfnApp, CfnBranch } from "aws-cdk-lib/aws-amplify"

export interface AmplifyStackProps extends StackProps {
  githubOauthToken: SecretValue
  repoOwner: string
  repoName: string
  domain: string
}

export class AmplifyStack extends Stack {
  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id, props)
    console.log(props)

    const amplifyApp = new amplify.App(this, "AmplifyAppResource", {
      // platform: amplify.Platform.WEB_COMPUTE,
      appName: props.repoName,
      description: "Nextjs frontend",
      role: new Role(this, "AmplifyRoleWebApp", {
        assumedBy: new ServicePrincipal("amplify.amazonaws.com"),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess-Amplify"),
        ],
      }),
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        oauthToken: props.githubOauthToken,
        owner: props.repoOwner,
        repository: props.repoName,
      }),
      buildSpec: BuildSpec.fromObjectToYaml({
        version: "1.0",
        applications: [
          {
            appRoot: "frontend",
            frontend: {
              phases: {
                preBuild: {
                  commands: [
                    "nvm install",
                    "nvm use",
                    "export NODE_OPTIONS=--max-old-space-size=8192",
                    "npm install",
                  ],
                },
                build: {
                  commands: ["npm run build"],
                },
              },
              artifacts: {
                baseDirectory: ".next",
                files: ["**/*"],
              },
            },
          },
        ],
      }),
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: "frontend",
      },
    })

    const cfnApp = amplifyApp.node.defaultChild as CfnApp
    cfnApp.platform = "WEB_COMPUTE"

    const mainBranch = amplifyApp.addBranch("main", {
      autoBuild: true,
      stage: "PRODUCTION",
    })

    const domain = amplifyApp.addDomain(props.domain, {
      enableAutoSubdomain: true,
    })
    domain.mapRoot(mainBranch)
    domain.mapSubDomain(mainBranch, "www")

    const cfnBranch = mainBranch.node.defaultChild as CfnBranch
    cfnBranch.framework = "Next.js - SSR"

    new CfnOutput(this, "AmplifyAppURL", {
      value: `https://main.${amplifyApp.defaultDomain}`,
      description: "Amplify App URL",
    })
  }
}
