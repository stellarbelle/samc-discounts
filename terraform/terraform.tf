terraform {
  cloud {
    organization = "djeebus"

    workspaces {
      name = "samc-discounts"
    }
  }

  required_providers {
    # https://registry.terraform.io/providers/hashicorp/aws/latest/docs
    aws = {
      source = "hashicorp/aws"
      version = ">= 5, < 6"
    }
  }
}
