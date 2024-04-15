## Application gateway public ip ##
resource "azurerm_public_ip" "appgateway_public_ip_weu" {
  name                = format("%s-appgateway-pip", local.project_weu)
  resource_group_name = azurerm_resource_group.rg_weu.name
  location            = azurerm_resource_group.rg_weu.location
  sku                 = "Standard"
  allocation_method   = "Static"
  zones               = [1]

  tags = var.tags
}

# Subnet to host the application gateway
module "appgateway_snet_weu" {
  source                                    = "git::https://github.com/pagopa/terraform-azurerm-v3.git//subnet?ref=v7.61.0"
  name                                      = format("%s-appgateway-snet", local.project_weu)
  address_prefixes                          = ["10.10.1.0/24"]
  resource_group_name                       = azurerm_resource_group.rg_weu.name
  virtual_network_name                      = azurerm_virtual_network.vnet_weu.name
  private_endpoint_network_policies_enabled = true

  service_endpoints = [
    "Microsoft.Web",
  ]

}

## Application gateway ##
module "app_gw_weu" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//app_gateway?ref=v7.61.0"

  resource_group_name = azurerm_resource_group.rg_weu.name
  location            = azurerm_resource_group.rg_weu.location
  name                = format("%s-appgateway", local.project_weu)
  zones               = [1]
  
  app_gateway_min_capacity = 1
  app_gateway_max_capacity = 2
   
  tags = var.tags

  identity_ids = [azurerm_user_assigned_identity.appgateway_itn.id]

  # SKU
  sku_name = "Standard_v2"
  sku_tier = "Standard_v2"

  # Networking
  subnet_id    = module.appgateway_snet_weu.id
  public_ip_id = azurerm_public_ip.appgateway_public_ip_weu.id

  trusted_client_certificates = []

  # Configure backends
  backends = {
    appbackend-app = {
      protocol     = "Http"
      host         = null
      port         = 443
      ip_addresses = null # with null value use fqdns
      fqdns = [
        module.app_service_weu.default_site_hostname
      ]
      probe                       = "/info"
      probe_name                  = "probe-appbackend-app"
      request_timeout             = 10
      pick_host_name_from_backend = true
    }
  }

  # Configure listeners
  listeners = {
    api-app-io-pagopa-it = {
      protocol           = "Http"
      host               = null
      port               = 80
      ssl_profile_name   = null
      firewall_policy_id = null
      certificate = {
        name = azurerm_key_vault_certificate.keyvault_certificate.name
        id = azurerm_key_vault_certificate.keyvault_certificate.versionless_id
      }
    }
  }

  # maps listener to backend
  routes = {
    api-app-io-pagopa-it = {
      listener              = "api-app-io-pagopa-it"
      backend               = "appbackend-app"
      rewrite_rule_set_name = "rewrite-rule-set-api-app"
      priority              = 70
    }
  }

  rewrite_rule_sets = [
    {
      name = "rewrite-rule-set-api-app"
      rewrite_rules = [{
        name          = "http-headers-api-app"
        rule_sequence = 100
        conditions    = []
        url           = null
        request_header_configurations = [
          {
            header_name  = "X-Forwarded-For"
            header_value = "{var_client_ip}"
          },
          {
            header_name  = "X-Client-Ip"
            header_value = "{var_client_ip}"
          },
        ]
        response_header_configurations = []
      }]
    },
  ]
}
