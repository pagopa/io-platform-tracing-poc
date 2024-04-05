import * as t from "io-ts";

import { Context } from "@azure/functions";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { initTelemetryClient } from "./appinsights";

export const TestInfoEvent = t.type({
  name: t.literal("test.info"),
  properties: t.intersection([
    t.type({
      hashedFiscalCode: NonEmptyString,
      messageId: NonEmptyString,
      verbose: t.boolean
    }),
    t.partial({
      switchedToAnonymous: t.boolean
    })
  ])
});

export const BusinessEvent = TestInfoEvent;
export type BusinessEvent = t.TypeOf<typeof BusinessEvent>;

export interface ILogger {
  /**
   * Logs an error string
   *
   * @param s an encoded error detail
   */
  readonly error: (s: string) => void;
  /**
   * Logs a warning string
   *
   * @param s an info string
   */
  readonly warning: (s: string) => void;
  /**
   * Logs an info string
   *
   * @param s an info string
   */
  readonly info: (s: string) => void;
  /**
   * Logs an info string
   *
   * @param s an info string
   */
  readonly trackEvent: (e: BusinessEvent) => void;
}

/**
 *
 * @param context
 * @param logPrefix
 * @returns
 */
export const createLogger = (
  context: Context,
  telemetryClient: ReturnType<typeof initTelemetryClient>,
  logPrefix: string
): ILogger => ({
  error: (s: string): void => {
    context.log.error(`${logPrefix}|${s}`);
  },
  info: (s: string): void => {
    context.log.info(`${logPrefix}|${s}`);
  },
  trackEvent: (e): void => {
    telemetryClient.trackEvent({
      name: e.name,
      properties: e.properties,
      tagOverrides: { samplingEnabled: "false" }
    });
  },
  warning: (s: string): void => {
    context.log.warn(`${logPrefix}|${s}`);
  }
});
