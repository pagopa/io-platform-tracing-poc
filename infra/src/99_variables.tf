variable "prefix" {
  type    = string
  default = "io"
  validation {
    condition = (
      length(var.prefix) < 6
    )
    error_message = "Max length is 6 chars."
  }
}

variable "env_short" {
  type = string
  validation {
    condition = (
      length(var.env_short) <= 1
    )
    error_message = "Max length is 1 chars."
  }
}

variable "location_we" {
  type    = string
  default = "westeurope"
}

variable "location_it" {
  type    = string
  default = "italynorth"
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}


###########
# Network #
###########

variable "subnets_cidrs" {
  type = object({
    app_service  = list(string)
    function_app = list(string)
  })
  description = "The CIDR address prefixes of the subnets"
}


############
# CosmosDB #
############

variable "cosmos_private_endpoint_enabled" {
  type = bool
}

variable "cosmos_public_network_access_enabled" {
  type = bool
}


########
# APIM #
########


variable "azure_apim_v2" {
  type        = string
  description = "APIM v2 resource name."
  default     = null
}

variable "azure_apim_resource_group" {
  type        = string
  description = "APIM resource group name."
  default     = null
}

variable "azure_apim_product_id" {
  type        = string
  description = "APIM Services Product id."
  default     = null
}


##########
# Webapp #
##########

variable "backoffice_host" {
  type        = string
  description = "Backoffice host name"
  default     = null
}

variable "functions_kind" {
  type        = string
  description = "App service plan kind"
  default     = null
}

variable "functions_sku_tier" {
  type        = string
  description = "App service plan sku tier"
  default     = null
}

variable "functions_sku_size" {
  type        = string
  description = "App service plan sku size"
  default     = null
}

variable "functions_autoscale_minimum" {
  type        = number
  description = "The minimum number of instances for this resource."
  default     = 1
}

variable "functions_autoscale_maximum" {
  type        = number
  description = "The maximum number of instances for this resource."
  default     = 30
}

variable "functions_autoscale_default" {
  type        = number
  description = "The number of instances that are available for scaling if metrics are not available for evaluation."
  default     = 1
}


#############################
# Cosmos DB Legacy Services #
#############################

variable "legacy_cosmosdb_resource_group" {
  type        = string
  description = "The name of the resource group where legacy data is"
}

variable "legacy_cosmosdb_resource_name" {
  type        = string
  description = "The name of the resource where legacy data is"
}

variable "legacy_cosmosdb_name" {
  type        = string
  description = "The name of the database where legacy data is"
}

variable "legacy_cosmosdb_container_services" {
  type        = string
  description = "The collection of the database where legacy data is"
  default     = "services"
}

variable "legacy_cosmosdb_container_services_lease" {
  type        = string
  description = "The lease collection that keeps track of our reads to the service collection change feed"
  default     = "services-cms--legacy-watcher-lease"
}

variable "legacy_service_watcher_max_items_per_invocation" {
  type        = number
  description = "Chunck size for the change feed"
}


#############
# IO Common #
#############

variable "io_common" {
  type = object({
    resource_group_name = string
    # Network
    vnet_name            = string
    appgateway_snet_name = string
    # Monitor
    application_insights_name = string
    action_group_email_name   = string
    action_group_slack_name   = string
  })
  description = "Name of common resources of IO platform"
}

###############################
# Feature Flags Configuration #
###############################

variable "userid_cms_to_legacy_sync_inclusion_list" {
  type        = string
  description = "User Ids to include in the sync from CMS to legacy"
}

variable "userid_legacy_to_cms_sync_inclusion_list" {
  type        = string
  description = "User Ids to include in the sync from legacy to CMS"
}

variable "userid_request_review_legacy_inclusion_list" {
  type        = string
  description = "User Ids to include in the request review from legacy services"
}

variable "userid_automatic_service_approval_inclusion_list" {
  type        = string
  description = "User Ids allowed to automatic service approval"
}

##############
# backoffice #
##############

variable "app_service" {
  type = object({
    sku_name                                  = string
    apim_user_groups                          = string
    azure_credentials_scope_url               = string
    azure_apim_subscriptions_api_base_url     = string
    selfcare_external_api_base_url            = string
    selfcare_jwks_path                        = string
    subscription_migration_api_url            = string
    api_services_cms_topics_cache_ttl_minutes = string
  })
  description = "Configuration of the io-services-cms-backoffice service"
}

variable "bo_auth_session_secret_rotation_id" {
  type        = string
  default     = "1695908210722"
  description = "You can renew the backoffice auth session secret by using a new, never-used-before value (hint: use the current timestamp)"
}

#####################
# container app job #
#####################

variable "container_app_environment" {
  type = object({
    name                = string
    resource_group_name = string
  })
}

variable "key_vault_common" {
  type = object({
    resource_group_name = string
    name                = string
    pat_secret_name     = string
  })
}

variable "vnet_address_space" {
  type    = list(string)
  default = ["10.10.0.0/16"]
}