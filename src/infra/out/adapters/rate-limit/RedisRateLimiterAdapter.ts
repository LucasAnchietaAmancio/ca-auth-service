import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import type { RedisClientType } from "redis";
import type RateLimitConfigDto from "@dto/RateLimitConfigDto.js";
import type RateLimiterAdapterPort from "@ports/out/RateLimiterAdapterPort.js";
import CacheException from "@exceptions/CacheException.js";
import RateLimitException from "@exceptions/RateLimitException.js";

export default class RedisRateLimiterAdapter implements RateLimiterAdapterPort {
    private readonly rateLimiter: RateLimiterRedis;

    public constructor(client: RedisClientType, config: RateLimitConfigDto) {
        this.rateLimiter = new RateLimiterRedis({
            storeClient: client,
            useRedisPackage: true,
            rejectIfRedisNotReady: true,
            keyPrefix: config.keyPrefix,
            points: config.points,
            duration: config.durationInSeconds,
            blockDuration: config.blockDurationInSeconds,
        });
    }

    public async consume(key: string): Promise<void> {
        try {
            await this.rateLimiter.consume(key);
        } catch (error) {
            if (error instanceof RateLimiterRes) throw new RateLimitException("Limite de requisições excedido", "RATE_LIMIT_EXCEEDED", {retryAfterInSeconds: Math.ceil(error.msBeforeNext / 1_000)});

            throw new CacheException("Ocorreu um erro ao validar o limite de requisições", "RATE_LIMIT_STORE_FAILED", {originalError: error instanceof Error ? error.message : "Erro desconhecido"});
        }
    }
}
