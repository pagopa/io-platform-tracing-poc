module "app_service_weu" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//app_service?ref=v7.77.0"

  name                = format("%s-tracing-poc-app", local.project_weu)
  location            = azurerm_resource_group.rg_weu.location
  resource_group_name = azurerm_resource_group.rg_weu.name

  plan_name = format("%s-tracing-poc-app-plan", local.project_weu)
  sku_name  = var.app_service.sku_name

  node_version = local.app_service_node_version

  health_check_path = local.app_service_health_check_path

  app_settings = merge(local.app_service_app_settings, {
    APP_ENV        = "production"
  })

  sticky_settings = [
    "IS_MSW_ENABLED",
    "APP_ENV"
  ]

  always_on        = true
  vnet_integration = true

  subnet_id = module.app_service_snet_weu.id

  allowed_subnets = [
    module.app_service_snet_weu.id
  ]

  tags = var.tags
}
