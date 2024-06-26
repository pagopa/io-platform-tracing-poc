import * as express from "express";

import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import {
  withRequestMiddlewares,
  wrapRequestHandler
} from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseErrorInternal,
  IResponseErrorNotFound,
  IResponseSuccessJson,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";

import { RequiredBodyPayloadMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_body_payload";
import { Context } from "@azure/functions";
import { ResourceWriter } from "./writers";
import { CreateResource } from "../generated/definitions/CreateResource";
import { CreatedResource } from "../generated/definitions/CreatedResource";

// -------------------------------------
// TestHandler
// -------------------------------------

type PostHandler = (
  context: Context,
  body: CreateResource
) => Promise<
  | IResponseSuccessJson<CreatedResource>
  | IResponseErrorInternal
  | IResponseErrorNotFound
>;

export const PostResourceHandler = (
  resourceWriter: ResourceWriter
): PostHandler => async (_, body): ReturnType<PostHandler> =>
  pipe(
    resourceWriter(body.fiscal_code),
    TE.map(res =>
      ResponseSuccessJson({ fiscal_code: res.fiscalCode, resource_id: res.id })
    ),
    TE.toUnion
  )();

export const PostResource = (
  resourceWriter: ResourceWriter
): express.RequestHandler => {
  const handler = PostResourceHandler(resourceWriter);
  const middlewaresWrap = withRequestMiddlewares(
    ContextMiddleware(),
    RequiredBodyPayloadMiddleware(CreateResource)
  );
  return wrapRequestHandler(middlewaresWrap(handler));
};
