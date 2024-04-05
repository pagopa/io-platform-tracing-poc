import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { IConfig } from "../utils/config";
import { NonNegativeInteger } from "@pagopa/ts-commons/lib/numbers";

export const envConfig: IConfig = {
  isProduction: false,

  APPINSIGHTS_INSTRUMENTATIONKEY: "aKey" as NonEmptyString,

  COSMOSDB_KEY: "aKey" as NonEmptyString,
  COSMOSDB_NAME: "aName" as NonEmptyString,
  COSMOSDB_URI: "aUri" as NonEmptyString,

  REMOTE_CONTENT_COSMOSDB_KEY: "aKey" as NonEmptyString,
  REMOTE_CONTENT_COSMOSDB_NAME: "aName" as NonEmptyString,
  REMOTE_CONTENT_COSMOSDB_URI: "aUri" as NonEmptyString,

  INTERNAL_USER_ID: "internalUserId" as NonEmptyString,

  MESSAGE_CONTAINER_NAME: "aaa" as NonEmptyString,
  QueueStorageConnection: "aaa" as NonEmptyString,

  FF_TYPE: "none",
  USE_FALLBACK: false,
  FF_BETA_TESTERS: [],
  FF_CANARY_USERS_REGEX: "XYZ" as NonEmptyString,

  REDIS_URL: "aRedisUrl" as NonEmptyString,
  RC_CONFIGURATION_CACHE_TTL: 1000 as NonNegativeInteger,

  NODE_ENV: "production",
  REQ_SERVICE_ID: undefined,

  MESSAGE_CONTENT_STORAGE_CONNECTION_STRING: "aConnString" as NonEmptyString,

  MESSAGE_CONFIGURATION_CHANGE_FEED_START_TIME: 0 as NonNegativeInteger,

  NOTIFICATION_QUEUE_NAME: "aQueueName" as NonEmptyString,
  NOTIFICATION_QUEUE_STORAGE_CONNECTION_STRING: "aQueueName" as NonEmptyString,

  BACKEND_BASE_URL: "aBaseUrl" as NonEmptyString,
  BACKEND_TOKEN: "aToken" as NonEmptyString
};
