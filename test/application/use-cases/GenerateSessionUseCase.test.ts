import { jest } from "@jest/globals";
import GenerateSessionUseCase from "@use-cases/GenerateSessionUseCase.js";
import CompanyEntity from "@entities/CompanyEntity.js";
import CompanyNotFoundError from "@exceptions/CompanyNotFoundError.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type ContaAzulPuppeteerAuthAdapterPort from "@ports/out/ContaAzulAuthAdapterPort.js";
import type CryptoHashAdapterPort from "@ports/out/EncryptAdapterPort.js";
import type SessionCacheAdapterPort from "@ports/out/SessionCacheAdapterPort.js";

describe("GenerateSessionUseCase", () => {
    it("Deve retornar um erro caso a empresa não exista", async () => {
        const contaAzulPuppeteerAuthAdapter: jest.Mocked<ContaAzulPuppeteerAuthAdapterPort> = {
            execute: jest.fn<ContaAzulPuppeteerAuthAdapterPort["execute"]>(),
        };
        const companyRepository: jest.Mocked<CompanyRepositoryPort> = {
            findById: jest.fn<CompanyRepositoryPort["findById"]>().mockResolvedValue(null),
            findByEmail: jest.fn<CompanyRepositoryPort["findByEmail"]>(),
            save: jest.fn<CompanyRepositoryPort["save"]>(),
        };
        const cryptoAdapter: jest.Mocked<CryptoHashAdapterPort> = {
            encrypt: jest.fn<CryptoHashAdapterPort["encrypt"]>(),
            decrypt: jest.fn<CryptoHashAdapterPort["decrypt"]>(),
        };
        const sessionCacheAdapter: jest.Mocked<SessionCacheAdapterPort> = {
            findByCompanyId: jest.fn<SessionCacheAdapterPort["findByCompanyId"]>(),
            save: jest.fn<SessionCacheAdapterPort["save"]>(),
        };
        const generateSessionUseCase = new GenerateSessionUseCase(
            contaAzulPuppeteerAuthAdapter,
            companyRepository,
            cryptoAdapter,
            sessionCacheAdapter,
        );

        await expect(generateSessionUseCase.execute({ companyId: "company-id" }))
            .rejects.toThrow(CompanyNotFoundError);
    });

    it("Deve gerar uma sessão para uma empresa existente", async () => {
        const company = CompanyEntity.restore(
            "company-id",
            "Empresa Teste",
            "email@teste.com",
            "encrypted_password",
            "encrypted_totp_secret",
        );
        const contaAzulPuppeteerAuthAdapter: jest.Mocked<ContaAzulPuppeteerAuthAdapterPort> = {
            execute: jest.fn<ContaAzulPuppeteerAuthAdapterPort["execute"]>().mockResolvedValue({
                accessToken: "access-token",
                expiresAt: 1_765_000_000,
            }),
        };
        const companyRepository: jest.Mocked<CompanyRepositoryPort> = {
            findById: jest.fn<CompanyRepositoryPort["findById"]>().mockResolvedValue(company),
            findByEmail: jest.fn<CompanyRepositoryPort["findByEmail"]>(),
            save: jest.fn<CompanyRepositoryPort["save"]>(),
        };
        const cryptoAdapter: jest.Mocked<CryptoHashAdapterPort> = {
            encrypt: jest.fn<CryptoHashAdapterPort["encrypt"]>(),
            decrypt: jest.fn<CryptoHashAdapterPort["decrypt"]>()
                .mockReturnValueOnce("hashed!@Password123")
                .mockReturnValueOnce("JBSWY3DPEBLW64TMMQQQ"),
        };
        const sessionCacheAdapter: jest.Mocked<SessionCacheAdapterPort> = {
            findByCompanyId: jest.fn<SessionCacheAdapterPort["findByCompanyId"]>().mockResolvedValue(null),
            save: jest.fn<SessionCacheAdapterPort["save"]>(),
        };
        const generateSessionUseCase = new GenerateSessionUseCase(
            contaAzulPuppeteerAuthAdapter,
            companyRepository,
            cryptoAdapter,
            sessionCacheAdapter,
        );

        const session = await generateSessionUseCase.execute({ companyId: company.companyId });

        expect(session).toBeDefined();
        expect(contaAzulPuppeteerAuthAdapter.execute).toHaveBeenCalledWith(
            company.email,
            "hashed!@Password123",
            "JBSWY3DPEBLW64TMMQQQ",
        );
        expect(session.expiresAt).toBe(1_765_000_000);
        expect(sessionCacheAdapter.save).toHaveBeenCalledWith(company.companyId, session);
    });
});
