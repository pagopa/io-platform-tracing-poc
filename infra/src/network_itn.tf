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