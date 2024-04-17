resource "azurerm_log_analytics_workspace" "law" {
  name = "${local.project_itn}-tracing-poc-law"
  location = var.location_it
  resource_group_name = azurerm_resource_group.rg_itn.name
  sku = "PerGB2018"
  retention_in_days = 30
}

resource "azurerm_application_insights" "ai" {
  name                = "${local.project_itn}-tracing-poc-ai"
  location            = var.location_it
  resource_group_name = azurerm_resource_group.rg_itn.name
  application_type    = "other"

  workspace_id = azurerm_log_analytics_workspace.law.id
}