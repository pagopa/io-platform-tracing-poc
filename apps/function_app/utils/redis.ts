/* eslint-disable no-invalid-this */
import * as redis from "redis";
import { IConfig } from "./config";

const DEFAULT_REDIS_PORT = "6379";

export type RedisClient = redis.RedisClientType | redis.RedisClusterType;

export class RedisClientFactory {
  protected readonly config: IConfig;
  // eslint-disable-next-line functional/prefer-readonly-type
  protected redisClient: RedisClient | undefined;

  constructor(config: IConfig) {
    this.config = config;
  }

  public readonly getInstance = async (): Promise<RedisClient> =>
    this.redisClient;

  protected readonly createSimpleRedisClient = async (
    redisUrl: string,
    password?: string,
    port?: string,
    useTls: boolean = true
  ): Promise<RedisClient> => {
    const redisPort: number = parseInt(port || DEFAULT_REDIS_PORT, 10);
    const redisClientConnection = redis.createClient<
      redis.RedisDefaultModules,
      Record<string, never>,
      Record<string, never>
    >({
      password,
      socket: {
        port: redisPort,
        tls: useTls
      },
      url: `redis://${redisUrl}`
    });
    await redisClientConnection.connect();
    return redisClientConnection;
  };

  protected readonly createClusterRedisClient = async (
    redisUrl: string,
    password?: string,
    port?: string
  ): Promise<RedisClient> => {
    const redisPort: number = parseInt(port || DEFAULT_REDIS_PORT, 10);
    const redisClientConnection = redis.createCluster<
      redis.RedisDefaultModules,
      Record<string, never>,
      Record<string, never>
    >({
      defaults: {
        legacyMode: true,
        password
      },
      rootNodes: [
        {
          url: `redis://${redisUrl}:${redisPort}`
        }
      ],
      useReplicas: true
    });
    await redisClientConnection.connect();
    return redisClientConnection;
  };
}
