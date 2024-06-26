import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { MessageModel, RetrievedMessageWithoutContent } from "@pagopa/io-functions-commons/dist/src/models/message";

import {
  IResponseErrorInternal,
  IResponseErrorNotFound,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";
import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { FeatureLevelTypeEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/FeatureLevelType";
import * as ulid from "ulid";
import { faker } from "@faker-js/faker";

export type ResourceWriter = (
  fiscalCode: FiscalCode
) => TE.TaskEither<IResponseErrorInternal | IResponseErrorNotFound, RetrievedMessageWithoutContent>;

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
        senderServiceId: faker.string.alphanumeric() as NonEmptyString,
        senderUserId: faker.string.alpha(10) as NonEmptyString,
        timeToLiveSeconds: 604800,
        kind: "INewMessageWithoutContent"
      }),
    TE.mapLeft(_ =>
      ResponseErrorInternal("Error while retrieving the message metadata")
    ), TE.map(res => ({
      ...res,
      kind: "IRetrievedMessageWithoutContent"
    }))
  );
