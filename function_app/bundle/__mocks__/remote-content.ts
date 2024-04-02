import { NonEmptyString, Ulid } from "@pagopa/ts-commons/lib/strings";
import { HasPreconditionEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/HasPrecondition";
import {
  RCConfiguration,
  RCConfigurationModel,
  RetrievedRCConfiguration
} from "@pagopa/io-functions-commons/dist/src/models/rc_configuration";
import {
  RetrievedUserRCConfiguration,
  UserRCConfiguration,
  UserRCConfigurationModel
} from "@pagopa/io-functions-commons/dist/src/models/user_rc_configuration";
import { NewRCConfigurationPublic } from "../generated/definitions/NewRCConfigurationPublic";
import { NonNegativeInteger } from "@pagopa/ts-commons/lib/numbers";
import { FiscalCode } from "../generated/definitions/FiscalCode";
import { aCosmosResourceMetadata } from "./models.mock";

const aPublicDetailAuthentication = {
  header_key_name: "a" as NonEmptyString,
  key: "key" as NonEmptyString,
  type: "type" as NonEmptyString
};

const aDetailAuthentication = {
  headerKeyName: "a" as NonEmptyString,
  key: "key" as NonEmptyString,
  type: "type" as NonEmptyString
};

export const aUserId = "aUserId" as NonEmptyString;

export const aRemoteContentConfiguration: RCConfiguration = {
  hasPrecondition: HasPreconditionEnum.ALWAYS,
  disableLollipopFor: [],
  isLollipopEnabled: false,
  configurationId: "01HNG1XBMT8V6HWGF5T053K9RJ" as Ulid,
  userId: aUserId,
  name: "aRemoteContentConfiguration" as NonEmptyString,
  description: "a description" as NonEmptyString,
  prodEnvironment: {
    baseUrl: "aValidUrl" as NonEmptyString,
    detailsAuthentication: aDetailAuthentication
  }
};

export const anotherRemoteContentConfiguration: RCConfiguration = {
  hasPrecondition: HasPreconditionEnum.ALWAYS,
  disableLollipopFor: [],
  isLollipopEnabled: false,
  configurationId: "01HNG1XBMT8V6HWGF5T053K9RK" as Ulid,
  userId: aUserId,
  name: "aRemoteContentConfiguration" as NonEmptyString,
  description: "a description" as NonEmptyString,
  prodEnvironment: {
    baseUrl: "aValidUrl" as NonEmptyString,
    detailsAuthentication: aDetailAuthentication
  }
};

export const aRetrievedRemoteContentConfiguration: RetrievedRCConfiguration = {
  ...aRemoteContentConfiguration,
  ...aCosmosResourceMetadata,
  id: `${aRemoteContentConfiguration.configurationId}-00000001` as NonEmptyString,
  version: 1 as NonNegativeInteger
};

export const aPublicRemoteContentConfiguration: NewRCConfigurationPublic = {
  has_precondition: HasPreconditionEnum.ALWAYS,
  disable_lollipop_for: [],
  is_lollipop_enabled: false,
  name: "aRemoteContentConfiguration" as NonEmptyString,
  description: "a description" as NonEmptyString,
  prod_environment: {
    base_url: "aValidUrl" as NonEmptyString,
    details_authentication: aPublicDetailAuthentication
  }
};

export const allLastVersionConfigurations: ReadonlyArray<RCConfiguration> = [aRemoteContentConfiguration, anotherRemoteContentConfiguration];

export const aUserRCC: UserRCConfiguration = {
  id: "01HNG1XBMT8V6HWGF5T053K9RK" as NonEmptyString,
  userId: aUserId
}

export const anotherUserRCC: UserRCConfiguration = {
  id: "01HNG1XBMT8V6HWGF5T053K9RJ" as NonEmptyString,
  userId: aUserId
}

export const aUserRCCList: ReadonlyArray<RetrievedUserRCConfiguration> = [
  {...aUserRCC, ...aCosmosResourceMetadata}, 
  {...anotherUserRCC, ...aCosmosResourceMetadata}, 
];

const aFiscalCode = "FRLFRC74E04B157I" as FiscalCode;

export const aRetrievedRCConfiguration: RetrievedRCConfiguration = {
  configurationId: "01HMRBX079WA5SGYBQP1A7FSKH" as Ulid,
  userId: aUserId,
  hasPrecondition: HasPreconditionEnum.ALWAYS,
  disableLollipopFor: [aFiscalCode],
  isLollipopEnabled: true,
  id: "id" as NonEmptyString,
  name: "name" as NonEmptyString,
  description: "description" as NonEmptyString,
  prodEnvironment: {
    baseUrl: "aValidUrl" as NonEmptyString,
    detailsAuthentication: aDetailAuthentication
  },
  version: 0 as NonNegativeInteger,
  ...aCosmosResourceMetadata
};

export const createNewConfigurationMock = jest.fn();
export const upsertConfigurationMock = jest.fn();
export const findLastVersionMock = jest.fn();
export const findAllLastVersionByConfigurationId = jest.fn();

export const rccModelMock = ({
  create: createNewConfigurationMock,
  upsert: upsertConfigurationMock,
  findLastVersionByModelId: findLastVersionMock,
  findAllLastVersionByConfigurationId: findAllLastVersionByConfigurationId
} as unknown) as RCConfigurationModel;

export const findAllByUserId = jest.fn();

export const userRCCModelMock = ({
  findAllByUserId: findAllByUserId,
} as unknown) as UserRCConfigurationModel;
