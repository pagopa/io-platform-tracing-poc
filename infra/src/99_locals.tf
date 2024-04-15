locals {
  project_weu              = "${var.prefix}-${var.env_short}-weu"
  project_itn              = "${var.prefix}-${var.env_short}-itn"
  is_prod              = var.env_short == "p" ? true : false
  application_basename = "tracing-poc"
}
  