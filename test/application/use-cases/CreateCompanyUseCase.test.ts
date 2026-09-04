import { jest } from "@jest/globals";
import CreateCompanyUseCase from "../../../src/application/use-cases/CreateCompanyUseCase.js";
import CompanyEntity from "@domain/entities/CompanyEntity.js";
import UserAlreadyExists from "@exceptions/UserAlreadyExists.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";

describe("CreateCompanyUseCase", () => {
    it("Deve criar uma empresa com o email normalizado", async () => {
        const companyRepository: jest.Mocked<CompanyRepositoryPort> = {
            findById: jest.fn<CompanyRepositoryPort["findById"]>(),
            findByEmail: jest.fn<CompanyRepositoryPort["findByEmail"]>().mockResolvedValue(null),
            save: jest.fn<CompanyRepositoryPort["save"]>().mockResolvedValue(undefined),
        };
        const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);

        const companyId = await createCompanyUseCase.execute({
            companyName: "Empresa Teste",
            email: "  Email@Teste.Com  ",
            password: "hashed!@Password123",
        });

        expect(companyId).toBeDefined();
        expect(companyRepository.findByEmail).toHaveBeenCalledWith("email@teste.com");
        expect(companyRepository.save).toHaveBeenCalledWith(expect.any(CompanyEntity));
        expect(companyRepository.save.mock.calls[0]?.[0]?.email).toBe("email@teste.com");
    });

    it("Deve retornar um erro caso a empresa já exista", async () => {
        const companyRepository: jest.Mocked<CompanyRepositoryPort> = {
            findById: jest.fn<CompanyRepositoryPort["findById"]>(),
            findByEmail: jest.fn<CompanyRepositoryPort["findByEmail"]>().mockResolvedValue(CompanyEntity.create(
                "Empresa Teste",
                "email@teste.com",
                "hashed!@Password123",
            )),
            save: jest.fn<CompanyRepositoryPort["save"]>(),
        };
        const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);

        await expect(createCompanyUseCase.execute({
            companyName: "Empresa Teste",
            email: "email@teste.com",
            password: "hashed!@Password123",
        })).rejects.toThrow(UserAlreadyExists);
    });
});
