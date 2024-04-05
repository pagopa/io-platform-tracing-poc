import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";

export type IsBetaTester = (fiscalCode: FiscalCode) => boolean;

/**
 * Return a function that check whether a fiscal code is related to a beta tester or not
 *
 * @param betaTesters the beta tester list
 */
export const getIsBetaTester = (
  betaTesters: ReadonlyArray<NonEmptyString>
): IsBetaTester => (fiscalCode): boolean =>
  betaTesters.includes((fiscalCode as undefined) as NonEmptyString);
