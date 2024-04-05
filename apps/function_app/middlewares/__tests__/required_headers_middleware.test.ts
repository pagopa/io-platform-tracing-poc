import * as E from "fp-ts/lib/Either";

import { RequiredUserIdMiddleware } from "../required_headers_middleware";
import { mockReq } from "../../__mocks__/express-types";

describe("RequiredUserIdMiddleware", () => {
  test("Should return a left in case the x-user-id is not provided", async () => {
    const r = await RequiredUserIdMiddleware()(mockReq({}));
    expect(E.isLeft(r)).toBeTruthy();
    if (E.isLeft(r))
      expect(r.left.detail).toBe(
        "Anonymous user: The request could not be associated to a user, missing userId or subscriptionId."
      );
  });

  test("Should return a left in case the x-user-id is an empty string", async () => {
    const req = mockReq({});
    req.header.mockReturnValueOnce("");
    const r = await RequiredUserIdMiddleware()(req);
    expect(E.isLeft(r)).toBeTruthy();
    if (E.isLeft(r))
      expect(r.left.detail).toBe(
        "Anonymous user: The request could not be associated to a user, missing userId or subscriptionId."
      );
  });

  test("Should return a right in case the x-user-id is a valid full path string", async () => {
    const req = mockReq({});
    req.header.mockReturnValueOnce("/subscriptions/anyid/resourceGroups/resource-group/providers/Microsoft.ApiManagement/service/resource/users/aUserId");
    const r = await RequiredUserIdMiddleware()(req);
    expect(E.isRight(r)).toBeTruthy();
    if (E.isRight(r)) expect(r.right).toBe("aUserId");
  });

  test("Should return a right in case the x-user-id is a valid non full path string", async () => {
    const req = mockReq({});
    req.header.mockReturnValueOnce("aUserId");
    const r = await RequiredUserIdMiddleware()(req);
    expect(E.isRight(r)).toBeTruthy();
    if (E.isRight(r)) expect(r.right).toBe("aUserId");
  });
});
