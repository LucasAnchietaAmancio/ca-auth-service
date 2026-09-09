import puppeteer, { type Page } from "puppeteer";
import type ContaAzulPuppeteerAuthAdapterPort from "@ports/out/ContaAzulPuppeteerAuthAdapterPort.js";
import type ContaAzulAuthAdapterResponseDto from "@dto/ContaAzulAuthAdapterResponseDto.js";
import type OtplibTotpAdapterPort from "@ports/out/OtplibTotpAdapterPort.js";
import ExternalAuthenticationException from "@exceptions/ExternalAuthenticationException.js";

interface ContaAzulLoginConfig {
    loginUrl: string;
    emailSelector: string;
    passwordSelector: string;
    submitSelector: string;
    totpSelector: string;
    errorSelector: string;
    authenticatedUrlPattern: string;
    accessTokenStorageKey: string;
    timeoutMs: number;
    headless: boolean;
}

export default class ContaAzulPuppeteerAuthAdapter implements ContaAzulPuppeteerAuthAdapterPort {
    private readonly config: ContaAzulLoginConfig;

    public constructor(private readonly totpAdapter: OtplibTotpAdapterPort, config: Partial<ContaAzulLoginConfig> = {}) {
        this.config = {
            loginUrl: process.env.CONTA_AZUL_LOGIN_URL ?? "https://login.contaazul.com",
            emailSelector: process.env.CONTA_AZUL_EMAIL_SELECTOR ?? 'input[type="email"]',
            passwordSelector: process.env.CONTA_AZUL_PASSWORD_SELECTOR ?? 'input[type="password"]',
            submitSelector: process.env.CONTA_AZUL_SUBMIT_SELECTOR ?? 'button[type="submit"]',
            totpSelector: process.env.CONTA_AZUL_TOTP_SELECTOR ?? 'input[autocomplete="one-time-code"]',
            errorSelector: process.env.CONTA_AZUL_ERROR_SELECTOR ?? '[role="alert"]',
            authenticatedUrlPattern: process.env.CONTA_AZUL_AUTHENTICATED_URL_PATTERN ?? "app.contaazul.com",
            accessTokenStorageKey: process.env.CONTA_AZUL_ACCESS_TOKEN_STORAGE_KEY ?? "access_token",
            timeoutMs: Number(process.env.CONTA_AZUL_LOGIN_TIMEOUT_MS ?? 30_000),
            headless: process.env.CONTA_AZUL_HEADLESS !== "false",
            ...config,
        };
    }

    public async execute(email: string, password: string, totpSecret: string): Promise<ContaAzulAuthAdapterResponseDto> {
        let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;

        try {
            browser = await puppeteer.launch({ headless: this.config.headless });
            const page = await browser.newPage();
            page.setDefaultTimeout(this.config.timeoutMs);

            await page.goto(this.config.loginUrl, { waitUntil: "networkidle2" });
            await page.locator(this.config.emailSelector).fill(email);
            await page.locator(this.config.passwordSelector).fill(password);
            await page.locator(this.config.submitSelector).click();
            await this.throwIfProviderError(page);

            const totpCode = await this.totpAdapter.execute(totpSecret);
            await page.locator(this.config.totpSelector).fill(totpCode);
            await page.locator(this.config.submitSelector).click();
            await page.waitForFunction(pattern => window.location.href.includes(pattern), {}, this.config.authenticatedUrlPattern);
            await this.throwIfProviderError(page);

            const accessToken = (await page.cookies()).find(c => c.name === 'x-ca-auth')?.value;

            if (!accessToken) {
                throw new ExternalAuthenticationException("A autenticação foi concluída sem uma sessão utilizável", "SESSION_CAPTURE_FAILED");
            }

            return { accessToken };
        } catch (error) {
            if (error instanceof ExternalAuthenticationException) throw error;
            throw new ExternalAuthenticationException("Falha ao autenticar no Conta Azul", "EXTERNAL_AUTHENTICATION_FAILED");
        } finally {
            await browser?.close();
        }
    }

    private async throwIfProviderError(page: Page): Promise<void> {
        if (await page.$(this.config.errorSelector)) {
            throw new ExternalAuthenticationException("O Conta Azul recusou a autenticação", "INVALID_EXTERNAL_CREDENTIALS");
        }
    }

}
