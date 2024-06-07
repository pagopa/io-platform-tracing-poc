/**
 * Config module
 *
 * Single point of access for the application confguration. Handles validation on required environment variables.
 * The configuration is evaluate eagerly at the first access to the module. The module exposes convenient methods to access such value.
 */

import * as t from "io-ts";

import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import {
  NonNegativeInteger,
  NonNegativeIntegerFromString
} from "@pagopa/ts-commons/lib/numbers";
import { withDefault } from "@pagopa/ts-commons/lib/types";

const HeapdumpConfig = t.intersection([
  t.type({
    HEAP_DUMP_STORAGE_CONN_STRING: NonEmptyString,
    HEAP_CHECK_CRONTAB: NonEmptyString,
    HEAP_CONTAINER_NAME: NonEmptyString,
    HEAP_LIMIT_PERCENTAGE: withDefault(
      NonNegativeIntegerFromString.pipe(NonNegativeInteger),
      "70" as unknown as NonNegativeInteger
    )
  }),
  t.partial({
    COMPUTERNAME: NonEmptyString
  })
]);
type HeapdumpConfig = t.TypeOf<typeof HeapdumpConfig>;

// global app configuration
export type IConfig = t.TypeOf<typeof IConfig>;
export const IConfig = t.intersection([
  t.type({
    /* eslint-disable sort-keys */
    APPINSIGHTS_INSTRUMENTATIONKEY: NonEmptyString,

    COSMOSDB_KEY: NonEmptyString,
    COSMOSDB_NAME: NonEmptyString,
    COSMOSDB_URI: NonEmptyString,

    MESSAGE_CONTAINER_NAME: NonEmptyString,

    QueueStorageConnection: NonEmptyString,

    STORAGE_CONNECTION_STRING: NonEmptyString,

    isProduction: t.boolean
    /* eslint-enable sort-keys */
  }),
  HeapdumpConfig
]);

// No need to re-evaluate this object for each call
const errorOrConfig: t.Validation<IConfig> = IConfig.decode({
  ...process.env,
  isProduction: process.env.NODE_ENV === "production"
});

/**
 * Read the application configuration and check for invalid values.
 * Configuration is eagerly evalued when the application starts.
 *
 * @returns either the configuration values or a list of validation errors
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getConfig(): t.Validation<IConfig> {
  return errorOrConfig;
}

/**
 * Read the application configuration and check for invalid values.
 * If the application is not valid, raises an exception.
 *
 * @returns the configuration values
 * @throws validation errors found while parsing the application configuration
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getConfigOrThrow(): IConfig {
  return pipe(
    errorOrConfig,
    E.getOrElse(errors => {
      throw new Error(`Invalid configuration: ${readableReport(errors)}`);
    })
  );
}
