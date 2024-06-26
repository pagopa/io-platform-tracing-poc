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
import { Context } from "@azure/functions";
import {  ResourceReader } from "./readers";

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
  resourceReader: ResourceReader
): GetHandler => async (
  _logger,
  fiscalCode,
  resourceId
): ReturnType<GetHandler> =>
  pipe(
    resourceReader(fiscalCode, resourceId),
    TE.map(_ => ResponseSuccessNoContent()),
    TE.toUnion
  )();

export const GetResource = (
  resourceReader: ResourceReader
): express.RequestHandler => {
  const handler = GetResourceHandler(
    resourceReader
  );
  const middlewaresWrap = withRequestMiddlewares(
    ContextMiddleware(),
    RequiredParamMiddleware("fiscal_code", FiscalCode),
    RequiredParamMiddleware("resource_id", NonEmptyString)
  );
  return wrapRequestHandler(middlewaresWrap(handler));
};
