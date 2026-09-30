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

variable "database_url" {
  type      = string
  sensitive = true
}

resource "aws_cognito_user_pool" "main" {
  name = "book-record-users"

  username_attributes = ["email"]

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

resource "aws_cognito_user_pool_client" "web" {
  name = "book-record-web"

  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret = false

  allowed_oauth_flows_user_pool_client = true

  allowed_oauth_flows = [
    "code"
  ]

  allowed_oauth_scopes = [
    "openid",
    "email",
    "profile"
  ]

  supported_identity_providers = [
    aws_cognito_identity_provider.google.provider_name
  ]

  callback_urls = [
    "http://localhost:3000"
  ]

  logout_urls = [
    "http://localhost:3000"
  ]
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.web.id
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "openid email profile"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}

variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type      = string
  sensitive = true
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "book-record-auth"
  user_pool_id = aws_cognito_user_pool.main.id
}