locals {
  app_service_node_version      = "18-lts"
  app_service_health_check_path = "/info"
  app_service_app_settings = merge({
    NODE_ENV                 = "production"
    WEBSITE_RUN_FROM_PACKAGE = "1"

    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.ai.instrumentation_key

    FN_CLIENT_BASE_URL = "https://${module.function_app_itn.default_hostname}"
    FN_CLIENT_KEY = module.function_app_itn.master_key

    // Fetch keepalive
    FETCH_KEEPALIVE_ENABLED             = "true"
    FETCH_KEEPALIVE_SOCKET_ACTIVE_TTL   = "110000"
    FETCH_KEEPALIVE_MAX_SOCKETS         = "40"
    FETCH_KEEPALIVE_MAX_FREE_SOCKETS    = "10"
    FETCH_KEEPALIVE_FREE_SOCKET_TIMEOUT = "30000"
    FETCH_KEEPALIVE_TIMEOUT             = "60000"

  })
}

module "app_service_itn" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//app_service?ref=v7.77.0"

  name                = format("%s-tracing-poc-app", local.project_itn)
  location            = azurerm_resource_group.rg_itn.location
  resource_group_name = azurerm_resource_group.rg_itn.name

  plan_name = format("%s-tracing-poc-app-plan", local.project_itn)
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

  subnet_id = module.app_service_snet_itn.id

  allowed_subnets = [
    module.app_service_snet_itn.id,
    module.appgateway_snet_itn.id
  ]

  tags = var.tags
}
