resource "azurerm_resource_group" "rg_itn" {
  name     = "${local.project_itn}-${local.application_basename}-rg"
  location = var.location_it

  tags = var.tags
}

resource "azurerm_resource_group" "rg_weu" {
  name     = "${local.project_weu}-${local.application_basename}-rg"
  location = var.location_we

  tags = var.tags
}