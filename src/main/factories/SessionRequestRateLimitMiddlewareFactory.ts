import type { RedisClientType } from "redis";
import type Envs from "@config/Envs.js";
import RedisRateLimiterAdapter from "@adapters/rate-limit/RedisRateLimiterAdapter.js";
import RateLimitMiddleware from "@middlewares/RateLimitMiddleware.js";

export default class SessionRequestRateLimitMiddlewareFactory {
    public static create(redisClient: RedisClientType, envs: Envs): RateLimitMiddleware {
        const rateLimiterAdapter = new RedisRateLimiterAdapter(redisClient, envs.rateLimit.sessionRequest);

        return new RateLimitMiddleware(rateLimiterAdapter);
    }
}
