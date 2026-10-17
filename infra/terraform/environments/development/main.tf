terraform {
  required_version = ">= 1.9.0"

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
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type      = string
  sensitive = true
}

module "app" {
  source = "../../modules/app"

  environment          = "development"
  resource_prefix      = "book-record-development"
  cognito_domain       = "book-record-development-auth"
  database_url         = var.database_url
  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
  callback_urls        = ["http://localhost:3000"]
  logout_urls          = ["http://localhost:3000"]
  cors_origin          = "http://localhost:3000"
}

output "api_url" {
  value = module.app.api_url
}

output "cognito_user_pool_id" {
  value = module.app.cognito_user_pool_id
}

output "cognito_client_id" {
  value = module.app.cognito_client_id
}
