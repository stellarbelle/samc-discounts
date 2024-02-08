data "tls_certificate" "thumbprint" {
  url = "https://oidc.eks.us-east-1.amazonaws.com"
}

resource "aws_iam_openid_connect_provider" "github-oidc" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.thumbprint.certificates[0].sha1_fingerprint]
  url             = "https://token.actions.githubusercontent.com"
}

data "aws_iam_policy_document" "github-action-policy" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    actions = [
      "s3:PutObject",
    ]

    resources = [
      "${aws_s3_bucket.assets.arn}/*",
    ]
  }
}

data "aws_iam_policy_document" "github-action-assume" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    principals {
      identifiers = [aws_iam_openid_connect_provider.github-oidc.arn]
      type        = "Federated"
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo: stellarbelle/samcdiscounts:ref:refs/heads/master"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "github-action" {
  name = "github-deploy-action"

  assume_role_policy = data.aws_iam_policy_document.github-action-assume.json
}

resource "aws_iam_role_policy" "github-action" {
  role   = aws_iam_role.github-action.id
  policy = data.aws_iam_policy_document.github-action-policy.json
}
