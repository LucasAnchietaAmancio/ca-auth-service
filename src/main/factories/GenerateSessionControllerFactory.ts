import type { PrismaClient } from "@prisma/client";
import GenerateSessionController from "@controllers/GenerateSessionController.js";
import GenerateSessionUseCase from "@use-cases/GenerateSessionUseCase.js";
import PostgresCompanyRepository from "@adapters/database/repositories/PostgresCompanyRepository.js";
import CryptoHashAdapter from "@adapters/hash/CryptoEncryptAdapter.js";
import OtplibTotpAdapter from "@adapters/auth/OtplibTotpAdapter.js";
import PuppeteerContaAzulAuthAdapter from "@adapters/auth/PuppeteerContaAzulAuthAdapter.js";
import RedisSessionCacheAdapter from "@adapters/cache/RedisSessionCacheAdapter.js";
import RedisRateLimiterAdapter from "@adapters/rate-limit/RedisRateLimiterAdapter.js";
import type Envs from "@config/Envs.js";
import type { RedisClientType } from "redis";

export default class GenerateSessionControllerFactory {
    public static create(db: PrismaClient, envs: Envs, redisClient: RedisClientType): GenerateSessionController {
        const companyRepository = new PostgresCompanyRepository(db);
        const cryptoAdapter = new CryptoHashAdapter(envs.crypto.secretKey);
        const totpAdapter = new OtplibTotpAdapter();
        const contaAzulAdapter = new PuppeteerContaAzulAuthAdapter(totpAdapter, envs.contaAzul);
        const sessionCacheAdapter = new RedisSessionCacheAdapter(redisClient);
        const externalAuthenticationRateLimiter = new RedisRateLimiterAdapter(redisClient, envs.rateLimit.externalAuthentication);
        const useCase = new GenerateSessionUseCase(contaAzulAdapter, companyRepository, cryptoAdapter, sessionCacheAdapter, externalAuthenticationRateLimiter);

        return new GenerateSessionController(useCase);
    }
}
