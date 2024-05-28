import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { IConfig } from "./utils/config";
import { errorsToReadableMessages } from "@pagopa/ts-commons/lib/reporters";

const env = {
  APPINSIGHTS_INSTRUMENTATIONKEY: "NonEmptyString",
  FN_CLIENT_KEY: "FN_CLIENT_KEY",
  HEAP_DUMP_ACTIVE: "false",
  HEAP_DUMP_STORAGE_CONN_STRING: "NonEmptyString",
  HEAP_CHECK_FREQUENCY_IN_MINUTES: "15",
  HEAP_CONTAINER_NAME: "NonEmptyString",
  HEAP_LIMIT_PERCENTAGE: "1",
  PORT: "",
};
pipe(
  IConfig.decode({
    ...env,
    HEAP_DUMP_ACTIVE: env.HEAP_DUMP_ACTIVE === "true",
    SERVER_PORT: env.PORT || "8080",
    isProduction: process.env.NODE_ENV === "production",
  }),
  E.mapLeft(errorsToReadableMessages),
  console.log
);
