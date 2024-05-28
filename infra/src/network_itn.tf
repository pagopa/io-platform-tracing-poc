resource "azurerm_virtual_network" "vnet_itn" {
  name                = "${local.project_itn}-vnet"
  address_space       = var.vnet_address_space_itn
  resource_group_name = azurerm_resource_group.rg_itn.name
  location            = azurerm_resource_group.rg_itn.location

  tags = var.tags
}

module "fn_app_snet_itn" {
  source               = "github.com/pagopa/terraform-azurerm-v3.git//subnet?ref=v7.77.0"
  name                 = "${local.project_itn}-tracing-poc-fnapp-snet"
  address_prefixes     = var.snet_function_app_address_spaces_itn
  resource_group_name  = azurerm_resource_group.rg_itn.name
  virtual_network_name = azurerm_virtual_network.vnet_itn.name

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

module "app_service_snet_itn" {
  source               = "github.com/pagopa/terraform-azurerm-v3.git//subnet?ref=v7.77.0"
  name                 = format("%s-tracing-poc-app-snet", local.project_itn)
  resource_group_name  = azurerm_resource_group.rg_itn.name
  virtual_network_name = azurerm_virtual_network.vnet_itn.name
  address_prefixes     = var.snet_app_service_address_spaces_itn

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

module "pendpoints_snet_itn" {
  source               = "github.com/pagopa/terraform-azurerm-v3.git//subnet?ref=v7.77.0"
  name                 = "${local.project_itn}-pendpoints-snet"
  address_prefixes     = var.snet_pendpoints_address_spaces_itn
  resource_group_name  = azurerm_resource_group.rg_itn.name
  virtual_network_name = azurerm_virtual_network.vnet_itn.name

  private_endpoint_network_policies_enabled     = false
  
}

resource "azurerm_private_dns_zone" "privatelink_documents" {
  name                = "privatelink.documents.azure.com"
  resource_group_name = azurerm_resource_group.rg_itn.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "link_itn" {
  name                  = azurerm_virtual_network.vnet_itn.name
  resource_group_name = azurerm_resource_group.rg_itn.name
  private_dns_zone_name = azurerm_private_dns_zone.privatelink_documents.name
  virtual_network_id    = azurerm_virtual_network.vnet_itn.id
}

resource "azurerm_private_endpoint" "sql_itn" {

  name                = format("%s-private-endpoint-sql", local.project_itn)
  location            = var.location_it
  resource_group_name = azurerm_resource_group.rg_itn.name
  subnet_id           = module.pendpoints_snet_itn.id

  private_service_connection {
    name                           = format("%s-private-endpoint-sql", local.project_itn)
    private_connection_resource_id = azurerm_cosmosdb_account.cosmos_account_itn.id
    is_manual_connection           = false
    subresource_names              = ["Sql"]
  }

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.privatelink_documents.id]
  }
}

module "vnet_peering_itn_weu" {
  source = "git::https://github.com/pagopa/terraform-azurerm-v3.git//virtual_network_peering?ref=v7.61.0"

  source_resource_group_name       = azurerm_resource_group.rg_itn.name
  source_virtual_network_name      = azurerm_virtual_network.vnet_itn.name
  source_remote_virtual_network_id = azurerm_virtual_network.vnet_itn.id
  source_allow_gateway_transit     = false # needed by vpn gateway for enabling routing from vnet to vnet_integration
  target_resource_group_name       = azurerm_resource_group.rg_weu.name
  target_virtual_network_name      = azurerm_virtual_network.vnet_weu.name
  target_remote_virtual_network_id = azurerm_virtual_network.vnet_weu.id
  target_use_remote_gateways       = false # needed by vpn gateway for enabling routing from vnet to vnet_integration
}