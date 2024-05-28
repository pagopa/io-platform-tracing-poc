
resource "azurerm_cosmosdb_account" "cosmos_account_weu" {
  name                = format("%s-cosmosdb", local.project_weu)
  location            = azurerm_resource_group.rg_weu.location
  resource_group_name = azurerm_resource_group.rg_weu.name
  offer_type          = "Standard"

  enable_automatic_failover = true

  consistency_policy {
    consistency_level       = "Strong"
  }

  geo_location {
    location          = var.location_we
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "db_weu" {
  name                = "db"
  resource_group_name = azurerm_resource_group.rg_weu.name
  account_name        = azurerm_cosmosdb_account.cosmos_account_weu.name
}

resource "azurerm_cosmosdb_sql_container" "messages_container_weu" {
  name                  = "messages"
  resource_group_name = azurerm_resource_group.rg_weu.name
  account_name        = azurerm_cosmosdb_account.cosmos_account_weu.name
  database_name         = azurerm_cosmosdb_sql_database.db_weu.name
  partition_key_path    = "/fiscalCode"
  partition_key_version = 2
}