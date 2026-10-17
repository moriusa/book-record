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

variable "callback_urls" {
  type = list(string)
}

variable "logout_urls" {
  type = list(string)
}

variable "cors_origin" {
  type = string
}

module "app" {
  source = "../../modules/app"

  environment          = "production"
  resource_prefix      = "book-record-production"
  cognito_domain       = "book-record-production-auth"
  database_url         = var.database_url
  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
  callback_urls        = var.callback_urls
  logout_urls          = var.logout_urls
  cors_origin          = var.cors_origin
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
