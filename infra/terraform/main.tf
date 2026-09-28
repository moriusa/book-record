terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
  }

  required_version = ">= 1.9.0"
}

provider "aws" {
  region = "ap-northeast-1"
}

output "api_url" {
  value = aws_apigatewayv2_stage.default.invoke_url
}