resource "azurerm_virtual_network" "vnet_weu" {
  name                = "${local.project_weu}-vnet"
  address_space       = var.vnet_address_space_weu
  resource_group_name = azurerm_resource_group.rg_weu.name
  location            = azurerm_resource_group.rg_weu.location

  tags = var.tags
}

module "fn_app_snet_weu" {
  source               = "github.com/pagopa/terraform-azurerm-v3.git//subnet?ref=v7.77.0"
  name                 = "${local.project_weu}-tracing-poc-fnapp-snet"
  address_prefixes     = var.snet_function_app_address_spaces_weu
  resource_group_name  = azurerm_resource_group.rg_weu.name
  virtual_network_name = azurerm_virtual_network.vnet_weu.name

  private_endpoint_network_policies_enabled     = true
  private_link_service_network_policies_enabled = true

  service_endpoints = [
    "Microsoft.Web",
    "Microsoft.AzureCosmosDB",
    "Microsoft.Storage",
  ]

  delegation = {
    name = "default"
    service_delegation = {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

module "app_service_snet_weu" {
  source               = "github.com/pagopa/terraform-azurerm-v3.git//subnet?ref=v7.77.0"
  name                 = format("%s-tracing-poc-app-snet", local.project_weu)
  resource_group_name  = azurerm_resource_group.rg_weu.name
  virtual_network_name = azurerm_virtual_network.vnet_weu.name
  address_prefixes     = var.snet_app_service_address_spaces_weu

  private_endpoint_network_policies_enabled = true

  service_endpoints = [
    "Microsoft.Web",
  ]

  delegation = {
    name = "default"
    service_delegation = {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

#
# Private endpoints
#

module "pendpoints_snet_weu" {
  source               = "github.com/pagopa/terraform-azurerm-v3.git//subnet?ref=v7.77.0"
  name                 = "${local.project_weu}-pendpoints-snet"
  address_prefixes     = var.snet_pendpoints_address_spaces_weu
  resource_group_name  = azurerm_resource_group.rg_weu.name
  virtual_network_name = azurerm_virtual_network.vnet_weu.name

  private_endpoint_network_policies_enabled     = false
  
}


resource "azurerm_private_dns_zone_virtual_network_link" "link_weu" {
  name                  = azurerm_virtual_network.vnet_weu.name
  resource_group_name = azurerm_resource_group.rg_itn.name
  private_dns_zone_name = azurerm_private_dns_zone.privatelink_documents.name
  virtual_network_id    = azurerm_virtual_network.vnet_weu.id
}

resource "azurerm_private_endpoint" "sql_weu" {

  name                = format("%s-private-endpoint-sql", local.project_weu)
  location            = var.location_we
  resource_group_name = azurerm_resource_group.rg_weu.name
  subnet_id           = module.pendpoints_snet_weu.id

  private_service_connection {
    name                           = format("%s-private-endpoint-sql", local.project_weu)
    private_connection_resource_id = azurerm_cosmosdb_account.cosmos_account_weu.id
    is_manual_connection           = false
    subresource_names              = ["Sql"]
  }

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.privatelink_documents.id]
  }
}