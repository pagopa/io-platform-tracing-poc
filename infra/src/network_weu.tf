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