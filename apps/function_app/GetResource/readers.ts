import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import {
  RetrievedMessage,
  MessageModel
} from "@pagopa/io-functions-commons/dist/src/models/message";

import {
  IResponseErrorInternal,
  IResponseErrorNotFound,
  ResponseErrorInternal,
  ResponseErrorNotFound
} from "@pagopa/ts-commons/lib/responses";
import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";

export type ResourceReader = (
  fiscalCode: FiscalCode,
  messageId: NonEmptyString
) => TE.TaskEither<
  IResponseErrorInternal | IResponseErrorNotFound,
  RetrievedMessage
>;

export const getResourceMetadata = (resourceModel: MessageModel): ResourceReader => (fiscalCode, messageId) =>
  pipe(
    resourceModel.findMessageForRecipient(fiscalCode, messageId),
    TE.mapLeft(_ =>
      ResponseErrorInternal("Error while retrieving the message metadata")
    ),
    TE.chainW(
      TE.fromOption(() =>
        ResponseErrorNotFound(
          "Message not found",
          `Message ${messageId} was not found for the given Fiscal Code`
        )
      )
    )
  );
