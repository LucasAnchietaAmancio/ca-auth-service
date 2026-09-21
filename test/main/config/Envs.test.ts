import Envs from "@config/Envs.js";
import EnvironmentError from "@domain/exceptions/EnvironmentError.js";

const validEnv: NodeJS.ProcessEnv = {
    DATABASE_URL: "postgresql://user:password@localhost:5432/auth_service",
    SECRET_KEY: "a-secret-key",
    API_ACCESS_TOKEN: "a-long-access-token",
    REDIS_URL: "redis://localhost:6379",
    RATE_LIMIT_SESSION_REQUEST_POINTS: "30",
    RATE_LIMIT_SESSION_REQUEST_DURATION_SECONDS: "60",
    RATE_LIMIT_SESSION_REQUEST_BLOCK_DURATION_SECONDS: "60",
    RATE_LIMIT_EXTERNAL_AUTH_POINTS: "1",
    RATE_LIMIT_EXTERNAL_AUTH_DURATION_SECONDS: "120",
    RATE_LIMIT_EXTERNAL_AUTH_BLOCK_DURATION_SECONDS: "300",
    PORT: "3000",
    CONTA_AZUL_LOGIN_URL: "https://login.example.com",
    CONTA_AZUL_EMAIL_SELECTOR: 'input[type="email"]',
    CONTA_AZUL_PASSWORD_SELECTOR: 'input[type="password"]',
    CONTA_AZUL_SUBMIT_SELECTOR: 'button[type="submit"]',
    CONTA_AZUL_TOTP_SELECTOR: 'input[autocomplete="one-time-code"]',
    CONTA_AZUL_ERROR_SELECTOR: '[role="alert"]',
    CONTA_AZUL_TOTP_ERROR_SELECTOR: ".ds-field__error-message--text",
    CONTA_AZUL_AUTHENTICATED_URL_PATTERN: "app.example.com",
    CONTA_AZUL_ACCESS_TOKEN_COOKIE_NAME: "access-token",
    CONTA_AZUL_EXPIRES_AT_COOKIE_NAME: "access-token-expiry",
    CONTA_AZUL_LOGIN_TIMEOUT_MS: "30000",
    CONTA_AZUL_HEADLESS: "true",
};

describe("Envs", () => {
    it("deve expor valores validados e tipados", () => {
        const envs = new Envs(validEnv);

        expect(envs.server.port).toBe(3000);
        expect(envs.crypto.secretKey).toBe("a-secret-key");
        expect(envs.authentication.accessToken).toBe("a-long-access-token");
        expect(envs.cache.redis.url).toBe("redis://localhost:6379");
        expect(envs.rateLimit.sessionRequest.points).toBe(30);
        expect(envs.rateLimit.externalAuthentication.blockDurationInSeconds).toBe(300);
        expect(envs.contaAzul.loginUrl).toBe("https://login.example.com");
        expect(envs.contaAzul.headless).toBe(true);
    });

    it("deve informar a chave ausente", () => {
        const { SECRET_KEY: _, ...envWithoutSecret } = validEnv;

        expect(() => new Envs(envWithoutSecret)).toThrow(EnvironmentError);
        expect(() => new Envs(envWithoutSecret)).toThrow('"SECRET_KEY"');
    });

    it("deve rejeitar URL de login sem HTTPS", () => {
        expect(() => new Envs({ ...validEnv, CONTA_AZUL_LOGIN_URL: "http://login.example.com" }))
            .toThrow(EnvironmentError);
    });
});
