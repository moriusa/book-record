resource "aws_lambda_function" "api" {
  function_name = "book-record-api"

  role = aws_iam_role.lambda.arn

  runtime = "nodejs22.x"
  handler = "lambda.handler"

  filename = data.archive_file.lambda.output_path

  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      DATABASE_URL = var.database_url
    }
  }
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id = "AllowAPIGatewayInvoke"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.api.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "../../apps/api/dist/lambda.js"
  output_path = "${path.module}/lambda.zip"
}