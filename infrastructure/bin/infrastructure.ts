#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import * as dotenv from "dotenv"
import { AmplifyStack } from "../lib/amplify-gen-stack"

dotenv.config({ path: "../.env" })

const {
  AWS_ACCOUNT_ID,
  AWS_REGION,
  DOMAIN,
  GITHUB_ACCESS_TOKEN,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
} = process.env

if (
  !AWS_ACCOUNT_ID ||
  !AWS_REGION ||
  !GITHUB_ACCESS_TOKEN ||
  !GITHUB_REPO_OWNER ||
  !GITHUB_REPO_NAME ||
  !DOMAIN
) {
  console.error("check .env file")
  throw new Error("check .env file")
}

const app = new cdk.App()
new AmplifyStack(app, "AmplifyStack", {
  githubOauthToken: cdk.SecretValue.unsafePlainText(GITHUB_ACCESS_TOKEN),
  repoOwner: GITHUB_REPO_OWNER,
  repoName: GITHUB_REPO_NAME,
  domain: DOMAIN,
  env: {
    account: AWS_ACCOUNT_ID,
    region: AWS_REGION,
  },
})
