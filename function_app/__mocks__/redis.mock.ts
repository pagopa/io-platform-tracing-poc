import { RedisClientFactory } from "../utils/redis";
export const redisClientMock = ({
  getInstance: jest.fn()
} as unknown) as RedisClientFactory;
