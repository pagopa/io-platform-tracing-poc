import * as express from "express";

import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import {
  withRequestMiddlewares,
  wrapRequestHandler
} from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseErrorForbiddenNotAuthorized,
  IResponseErrorInternal,
  IResponseErrorNotFound,
  IResponseSuccessNoContent,
  ResponseSuccessNoContent
} from "@pagopa/ts-commons/lib/responses";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { createLogger, ILogger } from "../utils/logger";

import { initTelemetryClient } from "../utils/appinsights";
import { MessageWithContentReader, ServiceReader } from "./readers";

// -------------------------------------
// TestHandler
// -------------------------------------

type TestHandler = (
  logger: ILogger
) => Promise<
  | IResponseSuccessNoContent
  | IResponseErrorInternal
  | IResponseErrorNotFound
  | IResponseErrorForbiddenNotAuthorized
>;

const aFiscalCode = "AAAA" as FiscalCode;
const aMessageId = "AAA" as NonEmptyString;

export const TestHandler = (
  retrieveMessageWithContent: MessageWithContentReader,
  retrieveService: ServiceReader
): TestHandler => async (_logger): ReturnType<TestHandler> =>
  pipe(
    retrieveMessageWithContent(aFiscalCode, aMessageId),
    TE.chain(msg => retrieveService(msg.senderServiceId)),
    TE.map(_ => ResponseSuccessNoContent()),
    TE.toUnion
  )();

export const Test = (
  retrieveMessageWithContent: MessageWithContentReader,
  retrieveService: ServiceReader,
  telemetryClient: ReturnType<typeof initTelemetryClient>
  // eslint-disable-next-line max-params
): express.RequestHandler => {
  const handler = TestHandler(retrieveMessageWithContent, retrieveService);
  const middlewaresWrap = withRequestMiddlewares(ContextMiddleware());
  return wrapRequestHandler(
    middlewaresWrap(context =>
      handler(createLogger(context, telemetryClient, "Test"))
    )
  );
};
