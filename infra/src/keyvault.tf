resource "azurerm_key_vault" "keyvault" {
  name                       = format("%s-key-vault", local.project_weu)
  location                   = azurerm_resource_group.rg_itn.location
  resource_group_name        = azurerm_resource_group.rg_itn.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_user_assigned_identity.appgateway_itn.client_id

    certificate_permissions = [
      "Get",
      "List",
    ]

    secret_permissions = [
      "Get",
      "List",
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = "b7e474ea-dbe5-44a2-922d-9d1c212cada6"

    certificate_permissions = [
      "Get",
      "List",
      "Create"
    ]

    secret_permissions = [
      "Get",
      "List",
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = "58e3c6d6-c60a-4147-ac68-5636f50012c3"

    certificate_permissions = [
      "Get",
      "List",
      "Create"
    ]

    secret_permissions = [
      "Get",
      "List",
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = "034f7d52-70c1-43f9-a4d2-e1d57057133c"

    certificate_permissions = [
      "Get",
      "List",
      "Create"
    ]

    secret_permissions = [
      "Get",
      "List",
    ]
  }
}

resource "azurerm_key_vault_certificate" "keyvault_certificate" {
  name         = "generated-cert"
  key_vault_id = azurerm_key_vault.keyvault.id

  certificate_policy {
    issuer_parameters {
      name = "Self"
    }

    key_properties {
      exportable = true
      key_size   = 2048
      key_type   = "RSA"
      reuse_key  = true
    }

    lifetime_action {
      action {
        action_type = "AutoRenew"
      }

      trigger {
        days_before_expiry = 30
      }
    }

    secret_properties {
      content_type = "application/x-pkcs12"
    }

    x509_certificate_properties {
      # Server Authentication = 1.3.6.1.5.5.7.3.1
      # Client Authentication = 1.3.6.1.5.5.7.3.2
      # extended_key_usage = ["1.3.6.1.5.5.7.3.1"]

      key_usage = [
        "cRLSign",
        "dataEncipherment",
        "digitalSignature",
        "keyAgreement",
        "keyCertSign",
        "keyEncipherment",
      ]

      subject_alternative_names {
        dns_names = ["internal.tracing-poc.com"]
      }

      subject            = "CN=hello-world"
      validity_in_months = 12
    }
  }
}