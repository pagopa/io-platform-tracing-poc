resource "azurerm_application_insights" "ai" {
  name                = "${local.project_itn}-tracing-poc-ai"
  location            = var.location_it
  resource_group_name = azurerm_resource_group.rg_itn.name
  application_type    = "other"
}