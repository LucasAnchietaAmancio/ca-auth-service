import puppeteer, { type Page } from "puppeteer";
import type ContaAzulAuthAdapterPort from "@ports/out/ContaAzulAuthAdapterPort.js";
import type ContaAzulAuthAdapterResponseDto from "@dto/ContaAzulAuthAdapterResponseDto.js";
import type TotpAdapterPort from "@ports/out/TotpAdapterPort.js";
import ExternalAuthenticationException from "@exceptions/ExternalAuthenticationException.js";
import type { ContaAzulLoginConfig } from "@config/Envs.js";

export default class PuppeteerContaAzulAuthAdapter implements ContaAzulAuthAdapterPort {
    public constructor(
        private readonly totpAdapter: TotpAdapterPort,
        private readonly config: ContaAzulLoginConfig,
    ) {}

    public async execute(email: string, password: string, totpSecret: string): Promise<ContaAzulAuthAdapterResponseDto> {
        let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;

        try {
            browser = await puppeteer.launch({ headless: this.config.headless });
            const page = await browser.newPage();
            page.setDefaultTimeout(this.config.timeoutMs);

            await this.authenticate(page, email, password, totpSecret);
            return await this.captureSession(page);
            
        } catch (error) {
            if (error instanceof ExternalAuthenticationException) throw error;
            throw new ExternalAuthenticationException("Falha ao autenticar no Conta Azul", "EXTERNAL_AUTHENTICATION_FAILED");
        } finally {
            await browser?.close();
        }
    }

    private async authenticate(page: Page, email: string, password: string, totpSecret: string): Promise<void> {
        await page.goto(this.config.loginUrl, { waitUntil: "networkidle2" });
        await page.locator(this.config.emailSelector).fill(email);
        await page.locator(this.config.passwordSelector).fill(password);
        await page.locator(this.config.submitSelector).click();
        await this.throwIfProviderError(page, this.config.errorSelector, "O Conta Azul recusou as credenciais", "INVALID_EXTERNAL_CREDENTIALS");

        const totpCode = await this.totpAdapter.execute(totpSecret);
        await page.locator(this.config.totpSelector).fill(totpCode);
        await page.locator(this.config.submitSelector).click();
        await this.waitForAuthenticationOrError(page, this.config.totpErrorSelector);
        await this.throwIfProviderError(page, this.config.totpErrorSelector, "O Conta Azul recusou o código TOTP", "INVALID_TOTP");
    }

    private async waitForAuthenticationOrError(page: Page, errorSelector: string): Promise<void> {
        await page.waitForFunction((authenticatedUrlPattern, selector) => window.location.href.includes(authenticatedUrlPattern) || document.querySelector(selector) !== null,{},
            this.config.authenticatedUrlPattern,
            errorSelector,
        );
    }

    private async captureSession(page: Page): Promise<ContaAzulAuthAdapterResponseDto> {
        const cookies = await page.cookies();
        const accessToken = cookies.find(cookie => cookie.name === this.config.accessTokenCookieName)?.value;
        const expiresAtCookie = cookies.find(cookie => cookie.name === this.config.expiresAtCookieName)?.value;
        const expiresAt = Number(expiresAtCookie);

        if (!accessToken || !expiresAtCookie || !Number.isFinite(expiresAt)) {
            throw new ExternalAuthenticationException("A autenticação foi concluída sem uma sessão utilizável", "SESSION_CAPTURE_FAILED");
        }

        return { accessToken, expiresAt };
    }

    private async throwIfProviderError(page: Page, errorSelector: string, message: string, tag: string): Promise<void> {
        if (await page.$(errorSelector)) {
            throw new ExternalAuthenticationException(message, tag);
        }
    }
}
