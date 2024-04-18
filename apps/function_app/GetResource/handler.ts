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

import { RequiredParamMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_param";
import { FiscalCodeMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/fiscalcode";
import { Context } from "@azure/functions";
import { MessageWithContentReader, ServiceReader } from "./readers";

// -------------------------------------
// GetHandler
// -------------------------------------

type GetHandler = (
  context: Context,
  fiscalCode: FiscalCode,
  resourceId: NonEmptyString
) => Promise<
  | IResponseSuccessNoContent
  | IResponseErrorInternal
  | IResponseErrorNotFound
  | IResponseErrorForbiddenNotAuthorized
>;

export const GetResourceHandler = (
  retrieveMessageWithContent: MessageWithContentReader
): GetHandler => async (
  _logger,
  fiscalCode,
  resourceId
): ReturnType<GetHandler> =>
  pipe(
    retrieveMessageWithContent(fiscalCode, resourceId),
    TE.map(_ => ResponseSuccessNoContent()),
    TE.toUnion
  )();

export const GetResource = (
  retrieveMessageWithContent: MessageWithContentReader
): express.RequestHandler => {
  const handler = GetResourceHandler(
    retrieveMessageWithContent
  );
  const middlewaresWrap = withRequestMiddlewares(
    ContextMiddleware(),
    FiscalCodeMiddleware,
    RequiredParamMiddleware("resourceid", NonEmptyString)
  );
  return wrapRequestHandler(middlewaresWrap(handler));
};
