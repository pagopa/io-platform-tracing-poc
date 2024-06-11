locals {
  project_weu              = "${var.prefix}-${var.env_short}-weu"
  project_itn              = "${var.prefix}-${var.env_short}-itn"
  is_prod              = var.env_short == "p" ? true : false
  application_basename = "tracing-poc"

  test_users_load_test = [
    for i in range(0, 1000): format("TPTEST00A00A%03dX", i)
  ]

  test_users = join(",",
    flatten([
      local.test_users_load_test,
      ]
    )
  )
}
  