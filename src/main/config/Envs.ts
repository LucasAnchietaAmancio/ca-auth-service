import EnvironmentError from "@config/errors/EnvironmentError.js";
import type RateLimitConfigDto from "@dto/RateLimitConfigDto.js";

interface ParseOptions {
    key: string;
    value: string | undefined;
}

export interface ContaAzulLoginConfig {
    loginUrl: string;
    emailSelector: string;
    passwordSelector: string;
    submitSelector: string;
    totpSelector: string;
    errorSelector: string;
    totpErrorSelector: string;
    authenticatedUrlPattern: string;
    accessTokenCookieName: string;
    expiresAtCookieName: string;
    timeoutMs: number;
    headless: boolean;
}

export default class Envs {
    public readonly database: { postgres: { uri: string } };
    public readonly cache: { redis: { url: string } };
    public readonly rateLimit: {
        sessionRequest: RateLimitConfigDto;
        externalAuthentication: RateLimitConfigDto;
    };
    public readonly crypto: { secretKey: string };
    public readonly authentication: { accessToken: string };
    public readonly server: { port: number };
    public readonly contaAzul: ContaAzulLoginConfig;

    public constructor(env: NodeJS.ProcessEnv) {
        this.database = {
            postgres: { uri: this.requiredString({ key: "DATABASE_URL", value: env.DATABASE_URL }) },
        };
        this.cache = {
            redis: { url: this.redisUrl({ key: "REDIS_URL", value: env.REDIS_URL }) },
        };
        this.rateLimit = {
            sessionRequest: {
                keyPrefix: "auth-service:session-request",
                points: this.positiveNumber({ key: "RATE_LIMIT_SESSION_REQUEST_POINTS", value: env.RATE_LIMIT_SESSION_REQUEST_POINTS }),
                durationInSeconds: this.positiveNumber({ key: "RATE_LIMIT_SESSION_REQUEST_DURATION_SECONDS", value: env.RATE_LIMIT_SESSION_REQUEST_DURATION_SECONDS }),
                blockDurationInSeconds: this.positiveNumber({ key: "RATE_LIMIT_SESSION_REQUEST_BLOCK_DURATION_SECONDS", value: env.RATE_LIMIT_SESSION_REQUEST_BLOCK_DURATION_SECONDS }),
            },
            externalAuthentication: {
                keyPrefix: "auth-service:external-authentication",
                points: this.positiveNumber({ key: "RATE_LIMIT_EXTERNAL_AUTH_POINTS", value: env.RATE_LIMIT_EXTERNAL_AUTH_POINTS }),
                durationInSeconds: this.positiveNumber({ key: "RATE_LIMIT_EXTERNAL_AUTH_DURATION_SECONDS", value: env.RATE_LIMIT_EXTERNAL_AUTH_DURATION_SECONDS }),
                blockDurationInSeconds: this.positiveNumber({ key: "RATE_LIMIT_EXTERNAL_AUTH_BLOCK_DURATION_SECONDS", value: env.RATE_LIMIT_EXTERNAL_AUTH_BLOCK_DURATION_SECONDS }),
            },
        };
        this.crypto = {
            secretKey: this.requiredString({ key: "SECRET_KEY", value: env.SECRET_KEY }),
        };
        this.authentication = {
            accessToken: this.requiredString({ key: "API_ACCESS_TOKEN", value: env.API_ACCESS_TOKEN }),
        };
        this.server = {
            port: this.positiveNumber({ key: "PORT", value: env.PORT }),
        };
        this.contaAzul = {
            loginUrl: this.httpsUrl({ key: "CONTA_AZUL_LOGIN_URL", value: env.CONTA_AZUL_LOGIN_URL }),
            emailSelector: this.requiredString({ key: "CONTA_AZUL_EMAIL_SELECTOR", value: env.CONTA_AZUL_EMAIL_SELECTOR }),
            passwordSelector: this.requiredString({ key: "CONTA_AZUL_PASSWORD_SELECTOR", value: env.CONTA_AZUL_PASSWORD_SELECTOR }),
            submitSelector: this.requiredString({ key: "CONTA_AZUL_SUBMIT_SELECTOR", value: env.CONTA_AZUL_SUBMIT_SELECTOR }),
            totpSelector: this.requiredString({ key: "CONTA_AZUL_TOTP_SELECTOR", value: env.CONTA_AZUL_TOTP_SELECTOR }),
            errorSelector: this.requiredString({ key: "CONTA_AZUL_ERROR_SELECTOR", value: env.CONTA_AZUL_ERROR_SELECTOR }),
            totpErrorSelector: this.requiredString({ key: "CONTA_AZUL_TOTP_ERROR_SELECTOR", value: env.CONTA_AZUL_TOTP_ERROR_SELECTOR }),
            authenticatedUrlPattern: this.requiredString({ key: "CONTA_AZUL_AUTHENTICATED_URL_PATTERN", value: env.CONTA_AZUL_AUTHENTICATED_URL_PATTERN }),
            accessTokenCookieName: this.requiredString({ key: "CONTA_AZUL_ACCESS_TOKEN_COOKIE_NAME", value: env.CONTA_AZUL_ACCESS_TOKEN_COOKIE_NAME }),
            expiresAtCookieName: this.requiredString({ key: "CONTA_AZUL_EXPIRES_AT_COOKIE_NAME", value: env.CONTA_AZUL_EXPIRES_AT_COOKIE_NAME }),
            timeoutMs: this.positiveNumber({ key: "CONTA_AZUL_LOGIN_TIMEOUT_MS", value: env.CONTA_AZUL_LOGIN_TIMEOUT_MS }),
            headless: this.boolean({ key: "CONTA_AZUL_HEADLESS", value: env.CONTA_AZUL_HEADLESS }),
        };
    }

    private requiredString({ key, value }: ParseOptions): string {
        const parsed = value?.trim();
        if (!parsed) throw new EnvironmentError(key, `A variavel de ambiente obrigatoria "${key}" nao esta definida.`);
        
        return parsed;
    }

    private positiveNumber({ key, value }: ParseOptions): number {
        const parsed = Number(this.requiredString({ key, value }));
        if (!Number.isFinite(parsed) || parsed <= 0) throw new EnvironmentError(key, `A variavel de ambiente "${key}" deve ser um numero positivo.`);
        
        return parsed;
    }

    private boolean({ key, value }: ParseOptions): boolean {
        const parsed = this.requiredString({ key, value }).toLowerCase();
        if (parsed === "true") return true;
        if (parsed === "false") return false;
        throw new EnvironmentError(key, `A variavel de ambiente "${key}" deve ser "true" ou "false".`);
    }

    private httpsUrl({ key, value }: ParseOptions): string {
        const parsed = this.requiredString({ key, value });
        try {
            if (new URL(parsed).protocol !== "https:") throw new Error();
            return parsed;
        } catch {
            throw new EnvironmentError(key, `A variavel de ambiente "${key}" deve ser uma URL HTTPS valida.`);
        }
    }

    private redisUrl({ key, value }: ParseOptions): string {
        const parsed = this.requiredString({ key, value });
        try {
            const url = new URL(parsed);
            if (url.protocol !== "redis:" && url.protocol !== "rediss:") throw new Error();
            return parsed;
        } catch {
            throw new EnvironmentError(key, `A variavel de ambiente "${key}" deve ser uma URL Redis valida.`);
        }
    }
}
