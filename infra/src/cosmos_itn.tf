
resource "azurerm_cosmosdb_account" "cosmos_account_itn" {
  name                = format("%s-cosmosdb", local.project_itn)
  location            = azurerm_resource_group.rg_itn.location
  resource_group_name = azurerm_resource_group.rg_itn.name
  offer_type          = "Standard"

  enable_automatic_failover = true

  consistency_policy {
    consistency_level       = "Strong"
  }

  geo_location {
    location          = var.location_it
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "db_itn" {
  name                = "db"
  resource_group_name = azurerm_resource_group.rg_itn.name
  account_name        = azurerm_cosmosdb_account.cosmos_account_itn.name
}

resource "azurerm_cosmosdb_sql_container" "messages_container_itn" {
  name                  = "messages"
  resource_group_name = azurerm_resource_group.rg_itn.name
  account_name        = azurerm_cosmosdb_account.cosmos_account_itn.name
  database_name         = azurerm_cosmosdb_sql_database.db_itn.name
  partition_key_path    = "/fiscalCode"
  partition_key_version = 2
}