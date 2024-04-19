#
# Function app definition
#

module "function_app_weu" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//function_app?ref=v7.77.0"

  resource_group_name = azurerm_resource_group.rg_weu.name
  name                = "${local.project_weu}-tracing-poc-fn"
  location            = azurerm_resource_group.rg_weu.location
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

  node_version    = 18
  runtime_version = "~4"

  always_on = "true"

  app_settings = merge(
    local.function_app_settings,
    {
      COSMOSDB_NAME = azurerm_cosmosdb_sql_database.db_weu.name
      COSMOSDB_URI  = azurerm_cosmosdb_account.cosmos_account_weu.endpoint
      COSMOSDB_KEY  = azurerm_cosmosdb_account.cosmos_account_weu.primary_key
    }
  )

  sticky_app_setting_names = []

  subnet_id = module.fn_app_snet_weu.id

  allowed_subnets = [
    module.fn_app_snet_weu.id,
    module.app_service_snet_weu.id,
  ]

  application_insights_instrumentation_key = azurerm_application_insights.ai.instrumentation_key

  tags = var.tags
}