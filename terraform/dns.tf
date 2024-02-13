resource "aws_route53_zone" "samcdiscounts" {
  name = "samcdiscounts.com"
}

output "samcdiscounts-nameservers" {
  value = aws_route53_zone.samcdiscounts.name_servers
}
