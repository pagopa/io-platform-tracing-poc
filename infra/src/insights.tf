resource "azurerm_application_insights" "ai" {
  name                = "${local.project}-tracing-poc-ai"
  location            = var.location_it
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "other"
}