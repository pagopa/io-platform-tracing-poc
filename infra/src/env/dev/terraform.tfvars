env_short = "d"

tags = {
  CreatedBy   = "Terraform"
  Environment = "Dev"
  Owner       = "IO"
  Source      = "https://github.com/pagopa/io-platform-tracing-poc"
  CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
}

## Network
# refer to https://github.com/pagopa/io-infra/blob/main/src/core/env/prod/terraform.tfvars#L26
#  for availble netowrk spaces
# You can retrieve the list of current defined subnets using the CLI command
# az network vnet subnet list --subscription PROD-IO --vnet-name io-p-vnet-common --resource-group io-p-rg-common --output table
# and thus define new CIDRs according to the unallocated address space
subnets_cidrs = {
  app_service  = ["10.10.1.128/26"]
  function_app = ["10.10.2.128/26"]
}

## Functions
functions_kind              = "Linux"
functions_sku_tier          = "PremiumV3"
functions_sku_size          = "P1v3"
functions_autoscale_minimum = 1
functions_autoscale_maximum = 3
functions_autoscale_default = 1

cosmos_private_endpoint_enabled      = true
cosmos_public_network_access_enabled = false

# Automatic service validation
manual_review_properties = "data.name,data.description,data.organization.name,data.organization.fiscal_code"

# Backoffice Configurations
backoffice_host = "selfcare.io.pagopa.it"
# app_service = {
#   sku_name                                  = "P1v3"
#   apim_user_groups                          = "apimessagewrite,apiinforead,apimessageread,apilimitedprofileread,apiservicewrite"
#   azure_credentials_scope_url               = "https://management.azure.com/.default"
#   azure_apim_subscriptions_api_base_url     = "https://management.azure.com/subscriptions/"
#   selfcare_external_api_base_url            = "https://api.selfcare.pagopa.it/external/v2"
#   selfcare_jwks_path                        = "/.well-known/jwks.json"
#   subscription_migration_api_url            = "https://io-p-subsmigrations-fn.azurewebsites.net/api/v1"
#   api_services_cms_topics_cache_ttl_minutes = "60"
# }