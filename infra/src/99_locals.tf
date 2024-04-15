locals {
  project              = "${var.prefix}-${var.env_short}"
  is_prod              = var.env_short == "p" ? true : false
  application_basename = "tracing-poc"
}
  