import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import { IRequestMiddleware } from "@pagopa/ts-commons/lib/request_middleware";
import {
  IResponse,
  ResponseErrorForbiddenAnonymousUser
} from "@pagopa/ts-commons/lib/responses";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { pipe } from "fp-ts/lib/function";

/*
 ** The right full path for ownerID is in this kind of format:
 ** "/subscriptions/subid/resourceGroups/{resourceGroup}/providers/Microsoft.ApiManagement/service/{apimService}/users/5931a75ae4bbd512a88c680b",
 ** resouce link: https://docs.microsoft.com/en-us/rest/api/apimanagement/current-ga/subscription/get
 */
export const parseOwnerIdFullPath = (
  fullPath: NonEmptyString
): NonEmptyString =>
  pipe(
    fullPath,
    f => f.split("/"),
    a => a[a.length - 1] as NonEmptyString
  );

export const RequiredUserIdMiddleware = (): IRequestMiddleware<
  "IResponseErrorForbiddenAnonymousUser",
  NonEmptyString
> => (
  request
): Promise<
  E.Either<IResponse<"IResponseErrorForbiddenAnonymousUser">, NonEmptyString>
> =>
  pipe(
    request.header("x-user-id"),
    NonEmptyString.decode,
    E.map(parseOwnerIdFullPath),
    E.mapLeft(() => ResponseErrorForbiddenAnonymousUser),
    T.of
  )();
