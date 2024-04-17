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
import { MessageWithContentReader, ServiceReader } from "./writers";

// -------------------------------------
// TestHandler
// -------------------------------------

type PostHandler = (
  context: Context,
  fiscalCode: FiscalCode,
  resourceId: NonEmptyString
) => Promise<
  | IResponseSuccessNoContent
  | IResponseErrorInternal
  | IResponseErrorNotFound
  | IResponseErrorForbiddenNotAuthorized
>;

export const PostResourceHandler = (
  retrieveMessageWithContent: MessageWithContentReader,
  retrieveService: ServiceReader
): PostHandler => async (
  _logger,
  fiscalCode,
  resourceId
): ReturnType<PostHandler> =>
  pipe(
    retrieveMessageWithContent(fiscalCode, resourceId),
    TE.chain(res => retrieveService(res.senderServiceId)),
    TE.map(_ => ResponseSuccessNoContent()),
    TE.toUnion
  )();

export const PostResource = (
  retrieveMessageWithContent: MessageWithContentReader,
  retrieveService: ServiceReader
  // eslint-disable-next-line max-params
): express.RequestHandler => {
  const handler = GetResourceHandler(
    retrieveMessageWithContent,
    retrieveService
  );
  const middlewaresWrap = withRequestMiddlewares(
    ContextMiddleware(),
    FiscalCodeMiddleware,
    RequiredParamMiddleware("resourceid", NonEmptyString)
  );
  return wrapRequestHandler(middlewaresWrap(handler));
};
