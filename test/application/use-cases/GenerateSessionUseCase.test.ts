import { jest } from "@jest/globals";
import GenerateSessionUseCase from "../../../src/application/use-cases/GenerateSessionUseCase.js";
import CompanyEntity from "@entities/CompanyEntity.js";
import CompanyNotFoundError from "@exceptions/CompanyNotFoundError.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type ContaAzulPuppeteerAuthAdapterPort from "@ports/out/ContaAzulPuppeteerAuthAdapterPort.js";
import type CryptoHashAdapterPort from "@ports/out/CryptoHashAdapterPort.js";

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
        const generateSessionUseCase = new GenerateSessionUseCase(
            contaAzulPuppeteerAuthAdapter,
            companyRepository,
            cryptoAdapter,
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
        const generateSessionUseCase = new GenerateSessionUseCase(
            contaAzulPuppeteerAuthAdapter,
            companyRepository,
            cryptoAdapter,
        );

        const session = await generateSessionUseCase.execute({ companyId: company.companyId });

        expect(session).toBeDefined();
        expect(contaAzulPuppeteerAuthAdapter.execute).toHaveBeenCalledWith(
            company.email,
            "hashed!@Password123",
            "JBSWY3DPEBLW64TMMQQQ",
        );
    });
});
