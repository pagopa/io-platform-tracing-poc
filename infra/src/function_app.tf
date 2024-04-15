#
# Function app definition
#

locals {
  function_app_settings = {
    FUNCTIONS_WORKER_RUNTIME       = "node"
    FUNCTIONS_WORKER_PROCESS_COUNT = "4"
    NODE_ENV                       = "production"

    // Keepalive fields are all optionals
    FETCH_KEEPALIVE_ENABLED             = "true"
    FETCH_KEEPALIVE_SOCKET_ACTIVE_TTL   = "110000"
    FETCH_KEEPALIVE_MAX_SOCKETS         = "40"
    FETCH_KEEPALIVE_MAX_FREE_SOCKETS    = "10"
    FETCH_KEEPALIVE_FREE_SOCKET_TIMEOUT = "30000"
    FETCH_KEEPALIVE_TIMEOUT             = "60000"

    # Source data
    COSMOSDB_NAME          = "db"
    COSMOSDB_URI           = data.azurerm_cosmosdb_account.cosmos_free.endpoint
    COSMOSDB_KEY           = data.azurerm_cosmosdb_account.cosmos_free.primary_key
    MESSAGE_CONTAINER_NAME = "messages"

    QueueStorageConnection = data.azurerm_storage_account.fnadmintest.primary_connection_string

    STORAGE_CONNECTION_STRING      = data.azurerm_storage_account.fnadmintest.primary_connection_string
    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.ai.instrumentation_key

  }
}

module "function_app" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app?ref=v7.77.0"

  resource_group_name = azurerm_resource_group.rg.name
  name                = "${local.project}-tracing-poc-fn"
  location            = azurerm_resource_group.rg.location
  health_check_path   = "/ready"

  export_keys = true

  app_service_plan_info = {
    kind                         = var.functions_kind
    sku_tier                     = var.functions_sku_tier
    sku_size                     = var.functions_sku_size
    zone_balancing_enabled       = false
    worker_count                 = 1
    maximum_elastic_worker_count = 0
  }

  node_version    = 18
  runtime_version = "~4"

  always_on = "true"

  app_settings = merge(
    local.function_app_settings,
    {}
  )

  sticky_app_setting_names = []

  subnet_id = module.fn_app_snet.id

  allowed_subnets = [
    module.fn_app_snet.id,
    module.app_service_snet.id,
  ]

  application_insights_instrumentation_key = azurerm_application_insights.ai.instrumentation_key

  tags = var.tags
}