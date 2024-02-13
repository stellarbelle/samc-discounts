locals {
  domain = "samcdiscounts.com"
  assetsDomain   = "assets.${local.domain}"
  s3behaviorName = "assets"
}

resource "random_password" "cf-to-s3-password" {
  length = 32
}

resource "aws_s3_bucket" "assets" {
  bucket = "assets-samcdiscounts"
}

resource "aws_acm_certificate" "assets" {
  domain_name       = local.domain
  validation_method = "DNS"

  subject_alternative_names = [
    "*.${local.domain}"
  ]
}

resource "aws_route53_record" "cert-validation" {
  for_each = {
    for dvo in aws_acm_certificate.assets.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = aws_route53_zone.samcdiscounts.id
  name    = each.value.name
  records = [each.value.record]
  type    = each.value.type

  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "cert-validation" {
  certificate_arn         = aws_acm_certificate.assets.arn
  validation_record_fqdns = [
    for record in aws_route53_record.cert-validation : record.fqdn
  ]
}

resource "aws_cloudfront_distribution" "assets" {
  enabled = true

  aliases      = [local.assetsDomain]
  comment      = "assets for samc-discounts.com"
  http_version = "http2and3"
  price_class  = "PriceClass_100"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    target_origin_id       = local.s3behaviorName
    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 300
    max_ttl                = 1200

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  origin {
    domain_name = local.assetsDomain
    origin_id   = local.s3behaviorName

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "User-Agent"
      value = random_password.cf-to-s3-password.result
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.assets.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}
