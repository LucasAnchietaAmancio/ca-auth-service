import { jest } from "@jest/globals";
import GenerateSessionUseCase from "../../../src/application/use-cases/GenerateSessionUseCase.js";
import CompanyEntity from "@domain/entities/CompanyEntity.js";
import CompanyNotFoundError from "@exceptions/CompanyNotFoundError.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type ContaAzulPuppeteerAuthAdapterPort from "@ports/out/ContaAzulPuppeteerAuthAdapterPort.js";

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
        const generateSessionUseCase = new GenerateSessionUseCase(
            contaAzulPuppeteerAuthAdapter,
            companyRepository,
        );

        await expect(generateSessionUseCase.execute({ companyId: "company-id" }))
            .rejects.toThrow(CompanyNotFoundError);
    });

    it("Deve gerar uma sessão para uma empresa existente", async () => {
        const company = CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "hashed!@Password123",
        );
        const contaAzulPuppeteerAuthAdapter: jest.Mocked<ContaAzulPuppeteerAuthAdapterPort> = {
            execute: jest.fn<ContaAzulPuppeteerAuthAdapterPort["execute"]>().mockResolvedValue({
                cookieHeader: "x-ca-auth",
                expiresAt: 7132164360,
                accessToken: "access-token",
            }),
        };
        const companyRepository: jest.Mocked<CompanyRepositoryPort> = {
            findById: jest.fn<CompanyRepositoryPort["findById"]>().mockResolvedValue(company),
            findByEmail: jest.fn<CompanyRepositoryPort["findByEmail"]>(),
            save: jest.fn<CompanyRepositoryPort["save"]>(),
        };
        const generateSessionUseCase = new GenerateSessionUseCase(
            contaAzulPuppeteerAuthAdapter,
            companyRepository,
        );

        const session = await generateSessionUseCase.execute({ companyId: company.companyId });

        expect(session).toBeDefined();
        expect(contaAzulPuppeteerAuthAdapter.execute).toHaveBeenCalledWith(
            company.email,
            company.password,
        );
    });
});
