import express from "express";
import * as winston from "winston";

import { createBlobService } from "azure-storage";
import { AzureFunction, Context } from "@azure/functions";

import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import { withAppInsightsContext } from "@pagopa/io-functions-commons/dist/src/utils/application_insights";
import { AzureContextTransport } from "@pagopa/io-functions-commons/dist/src/utils/logging";
import {
  MessageModel,
  MESSAGE_COLLECTION_NAME
} from "@pagopa/io-functions-commons/dist/src/models/message";
import { ServiceModel } from "@pagopa/io-functions-commons/dist/src/models/service";
import { initTelemetryClient } from "../utils/appinsights";
import { getConfigOrThrow } from "../utils/config";
import { cosmosdbInstance } from "../utils/cosmosdb";

import { GetResource } from "./handler";
import { getMessageWithContent, getService } from "./readers";

// Get config
const config = getConfigOrThrow();

// eslint-disable-next-line functional/no-let
let logger: Context["log"] | undefined;
const contextTransport = new AzureContextTransport(() => logger, {
  level: "debug"
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
winston.add(contextTransport as any);

const blobService = createBlobService(config.STORAGE_CONNECTION_STRING);

// Setup Express
const app = express();
secureExpressApp(app);

initTelemetryClient();

// Models
const messageModel = new MessageModel(
  cosmosdbInstance.container(MESSAGE_COLLECTION_NAME),
  config.MESSAGE_CONTAINER_NAME
);

const serviceModel = new ServiceModel(cosmosdbInstance.container("services"));

// Add express route
app.get(
  "/api/v1/resources/:fiscalCode/:resourceid",
  GetResource(
    getMessageWithContent(messageModel, blobService),
    getService(serviceModel)
  )
);

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  logger = context.log;
  setAppContext(app, context);
  withAppInsightsContext(context, () => azureFunctionHandler(context));
};

export default httpStart;
