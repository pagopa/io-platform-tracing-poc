/* eslint-disable no-console */
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import express from "express";
import * as bodyParser from "body-parser";
import { flow, pipe } from "fp-ts/lib/function";
import { errorsToReadableMessages } from "@pagopa/ts-commons/lib/reporters";
import { getConfigOrThrow } from "./utils/config";
import { initTelemetryClient } from "./utils/appinsights";
import { FnClient } from "./utils/client";
import { GetResourceParams } from "./utils/types";
import { CreateResource } from "../generated/definitions/CreateResource";
import { IResponseType } from "@pagopa/ts-commons/lib/requests";
import { CreatedResource } from "../generated/definitions/CreatedResource";
import * as v8 from "v8"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createApp = async () => {
  const config = getConfigOrThrow();

  const apiClient = FnClient(config.FN_CLIENT_KEY, config.FN_CLIENT_BASE_URL);
  const app = express();

  initTelemetryClient();
  // Parse the incoming request body. This is needed by Passport spid strategy.
  app.use(
    bodyParser.json({
      verify: (_req, res: express.Response, buf, _encoding: BufferEncoding) => {
        // eslint-disable-next-line functional/immutable-data
        res.locals.body = buf;
      },
    })
  );

  // Parse an urlencoded body.
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/info", (_: express.Request, res: express.Response) =>
    res.status(200).json({ status: "OK" })
  );

  app.get("/resources/:fiscal_code/:resource_id", (req: express.Request, res: express.Response) =>
    pipe(
      {
        fiscal_code: req.params.fiscal_code,
        resource_id: req.params.resource_id,
      },
      GetResourceParams.decode,
      E.mapLeft((errs) => Error(errorsToReadableMessages(errs).join("|"))),
      TE.fromEither,
      TE.chain((params) =>
        TE.tryCatch(
          () =>
            apiClient.getResource({
              fiscal_code: params.fiscal_code,
              resource_id: params.resource_id,
            }),
          E.toError
        )
      ),
      TE.chain(
        flow(
          E.mapLeft((errs) => Error(errorsToReadableMessages(errs).join("|"))),
          TE.fromEither
        )
      ),
      TE.chain(
        TE.fromPredicate(
          (response) => response.status === 204,
          (wrongRes) =>
            Error(`Error while calling api|ERROR=${JSON.stringify(wrongRes)}`)
        )
      ),
      TE.map(() => res.status(200).json({ status: "OK" })),
      TE.mapLeft((err) => res.status(500).json({ error: String(err) }))
    )()
  );

  app.post("/resource", (req: express.Request, res: express.Response) =>
    pipe(
      req.body,
      CreateResource.decode,
      E.mapLeft((errs) => Error(errorsToReadableMessages(errs).join("|"))),
      TE.fromEither,
      TE.chain((reqBody) =>
        TE.tryCatch(
          () =>
            apiClient.postResource({body: reqBody}),
          E.toError
        )
      ),
      TE.chain(
        flow(
          E.mapLeft((errs) => Error(errorsToReadableMessages(errs).join("|"))),
          TE.fromEither
        )
      ),
      TE.chain(
        TE.fromPredicate(
          (response): response is IResponseType<200, CreatedResource, never> =>
            response.status === 200,
          (wrongRes) =>
            Error(`Error while calling api|ERROR=${JSON.stringify(wrongRes)}`)
        )
      ),
      TE.map((response) => res.status(200).json(response.value)),
      TE.mapLeft((err) => res.status(500).json({ error: String(err) }))
    )()
  );

  app.listen(config.SERVER_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app service listening on port ${config.SERVER_PORT}`);
  });

  setInterval(() => v8.writeHeapSnapshot(), 60000 * 15)
};

createApp().then(console.log).catch(console.error);
