import { pipe } from "fp-ts/lib/function";
import { getBlobServiceClient, uploadFile } from "../utils/blob";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";

export const getHeapWriter = (
  storageConnString: NonEmptyString,
  heapContainerName: NonEmptyString
) =>
  pipe(getBlobServiceClient(storageConnString), client => ({
    writeBlob: uploadFile(client, heapContainerName)
  }));
