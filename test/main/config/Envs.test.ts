import Envs from "@config/Envs.js";
import EnvironmentError from "@config/errors/EnvironmentError.js";

const validEnv: NodeJS.ProcessEnv = {
    DATABASE_URL: "postgresql://user:password@localhost:5432/auth_service",
    SECRET_KEY: "a-secret-key",
    REDIS_URL: "redis://localhost:6379",
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
        expect(envs.cache.redis.url).toBe("redis://localhost:6379");
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
