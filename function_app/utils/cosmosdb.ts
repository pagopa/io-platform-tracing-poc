/**
 * Use a singleton CosmosDB client across functions.
 */
import { CosmosClient } from "@azure/cosmos";

import { getConfigOrThrow } from "../utils/config";

const config = getConfigOrThrow();

// Setup DocumentDB
export const cosmosDbUri = config.COSMOSDB_URI;
export const cosmosDbName = config.COSMOSDB_NAME;
export const cosmosDbKey = config.COSMOSDB_KEY;

export const cosmosdbClient = new CosmosClient({
  endpoint: cosmosDbUri,
  key: cosmosDbKey
});

export const cosmosdbInstance = cosmosdbClient.database(cosmosDbName);

// setup cosmosdb for RC
export const remoteContentCosmosDbUri = config.REMOTE_CONTENT_COSMOSDB_URI;
export const remoteContentCosmosDbName = config.REMOTE_CONTENT_COSMOSDB_NAME;
export const remoteContentCosmosDbKey = config.REMOTE_CONTENT_COSMOSDB_KEY;

export const remoteContentCosmosDbClient = new CosmosClient({
  endpoint: remoteContentCosmosDbUri,
  key: remoteContentCosmosDbKey
});

export const remoteContentCosmosDbInstance = remoteContentCosmosDbClient.database(
  remoteContentCosmosDbName
);
