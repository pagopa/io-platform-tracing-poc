import { BlobServiceClient } from "@azure/storage-blob";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { Readable } from "node:stream";
import { constVoid, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

export const getBlobServiceClient = (connString: NonEmptyString) =>
  BlobServiceClient.fromConnectionString(connString);

export const uploadFile =
  (blobClient: BlobServiceClient, containerName: NonEmptyString) =>
  (blobName: string, stream: Readable): TE.TaskEither<Error, void> =>
    pipe(
      blobClient.getContainerClient(containerName),
      (containerClient) => containerClient.getBlockBlobClient(blobName),
      (blobClient) =>
        TE.tryCatch(() => blobClient.uploadStream(stream), E.toError),
      TE.map(constVoid)
    );
