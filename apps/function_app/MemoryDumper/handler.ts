import { Context } from "@azure/functions";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { getHeapWriter } from "../utils/heap";
import { NonNegativeInteger } from "@pagopa/ts-commons/lib/numbers";
import * as v8 from "v8";

const getFilename = (siteName?: NonEmptyString) =>
  pipe(
    new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/\..+/, "")
      .replace(/\:/, "-"),
    dateFmt =>
      pipe(
        siteName,
        O.fromNullable,
        O.map(name => `${dateFmt}-${name}`),
        O.getOrElse(() => dateFmt)
      )
  );

export const memoryDumperHandler = (
  heapWriter: ReturnType<typeof getHeapWriter>,
  heapLimitPercentage: NonNegativeInteger,
  hostName: NonEmptyString
) => async (_context: Context): Promise<unknown> =>
  pipe(
    v8.getHeapStatistics(),
    memInfo => (memInfo.used_heap_size * 100) / memInfo.heap_size_limit,
    O.fromPredicate(perc => perc > heapLimitPercentage),
    O.map(() =>
      pipe(v8.getHeapSnapshot(), snapshotStream =>
        heapWriter.writeBlob(
          `${getFilename(hostName)}-heapdump.heapsnapshot`,
          snapshotStream
        )
      )
    ),
    O.getOrElseW(() => TE.right(void 0)),
    TE.toUnion
  )();
