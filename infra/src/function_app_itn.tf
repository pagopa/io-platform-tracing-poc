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

    MESSAGE_CONTAINER_NAME = "messages"

    QueueStorageConnection = data.azurerm_storage_account.fnadmintest.primary_connection_string

    STORAGE_CONNECTION_STRING      = data.azurerm_storage_account.fnadmintest.primary_connection_string
    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.ai.instrumentation_key

    HEAP_CONTAINER_NAME           = "heapdump"
    HEAP_CHECK_CRONTAB            = "*/15 * * * *"
    HEAP_DUMP_STORAGE_CONN_STRING = data.azurerm_storage_account.fnadmintest.primary_connection_string

  }
}

module "function_app_itn" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app?ref=threat-protection-st"

  resource_group_name = azurerm_resource_group.rg_itn.name
  name                = "${local.project_itn}-tracing-poc-fn"
  location            = azurerm_resource_group.rg_itn.location
  health_check_path   = "/api/ready"

  export_keys = true

  app_service_plan_info = {
    kind                         = var.functions_kind
    sku_tier                     = var.functions_sku_tier
    sku_size                     = var.functions_sku_size
    zone_balancing_enabled       = false
    worker_count                 = 1
    maximum_elastic_worker_count = 0
  }

  storage_account_info = {
    account_kind                      = "StorageV2"
    account_tier                      = "Standard"
    account_replication_type          = "ZRS"
    access_tier                       = "Hot"
    advanced_threat_protection_enable = false
    use_legacy_defender_version       = false
    public_network_access_enabled     = false
  }

  node_version    = 18
  runtime_version = "~4"

  always_on = "true"

  app_settings = merge(
    local.function_app_settings,
    {
      # Source data
      COSMOSDB_NAME = azurerm_cosmosdb_sql_database.db_itn.name
      COSMOSDB_URI  = azurerm_cosmosdb_account.cosmos_account_itn.endpoint
      COSMOSDB_KEY  = azurerm_cosmosdb_account.cosmos_account_itn.primary_key

      "AzureWebJobs.MemoryDumper.Disabled" = "0"
    }
  )

  sticky_app_setting_names = []

  subnet_id = module.fn_app_snet_itn.id

  allowed_subnets = [
    module.fn_app_snet_itn.id,
    module.app_service_snet_itn.id,
  ]

  application_insights_instrumentation_key = azurerm_application_insights.ai.instrumentation_key

  tags = var.tags
}