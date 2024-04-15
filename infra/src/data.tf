data "azurerm_cosmosdb_account" "cosmos_free" {
  name                = "io-d-cosmos-free"
  resource_group_name = "io-d-rg-common"
}

data "azurerm_storage_account" "fnadmintest" {
  name                = "fnadmintest"
  resource_group_name = "dev-emanuele"
}