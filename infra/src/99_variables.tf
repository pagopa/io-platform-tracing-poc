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

variable "vnet_address_space_itn" {
  type    = list(string)
  default = ["10.10.0.0/20"]
}

variable "vnet_address_space_weu" {
  type    = list(string)
  default = ["10.20.0.0/20"]
}

variable "snet_app_service_address_spaces_itn" {
  type    = list(string)
  default = ["10.10.1.0/24"]
}

variable "snet_app_service_address_spaces_weu" {
  type    = list(string)
  default = ["10.20.1.0/24"]
}

variable "snet_function_app_address_spaces_itn" {
  type    = list(string)
  default = ["10.10.2.0/24"]
}

variable "snet_function_app_address_spaces_weu" {
  type    = list(string)
  default = ["10.20.2.0/24"]
}

variable "app_service" {
  type = object({
    sku_name           = string
    functions_sku_size = string
  })
  default = {
    sku_name           = "P1v3"
    functions_sku_size = "PremiumV3"
  }
}


