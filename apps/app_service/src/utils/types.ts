import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import * as t from "io-ts";

export const GetResourceParams = t.type({
  fiscal_code: FiscalCode,
  resource_id: NonEmptyString
})
export type GetResourceParams = t.TypeOf<typeof GetResourceParams>;