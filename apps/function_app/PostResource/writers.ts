import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { MessageModel } from "@pagopa/io-functions-commons/dist/src/models/message";

import {
  IResponseErrorInternal,
  IResponseErrorNotFound,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";
import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { FeatureLevelTypeEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/FeatureLevelType";
import * as ulid from "ulid";

export type ResourceWriter = (
  fiscalCode: FiscalCode
) => TE.TaskEither<IResponseErrorInternal | IResponseErrorNotFound, boolean>;

export const writeResource = (
  model: MessageModel
): ResourceWriter => fiscalCode =>
  pipe(
    ulid.ulid() as NonEmptyString,
    resourceId =>
      model.upsert({
        fiscalCode,
        id: resourceId,
        indexedId: resourceId,
        createdAt: new Date(),
        featureLevelType: FeatureLevelTypeEnum.STANDARD,
        senderServiceId: undefined,
        senderUserId: undefined,
        timeToLiveSeconds: 604800,
        kind: "INewMessageWithoutContent"
      }),
    TE.mapLeft(_ =>
      ResponseErrorInternal("Error while retrieving the message metadata")
    ),
    TE.map(() => true as const)
  );
