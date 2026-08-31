import CreateCompanyUseCase from "../../../src/application/use-cases/CreateCompanyUseCase.js";
import CompanyEntity from "@domain/entities/CompanyEntity.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type HashAdapterPort from "@ports/out/HashAdapterPort.js";

describe("CreateCompanyUseCase", () => {
    it("deve aplicar hash à senha antes de persistir a empresa", async () => {
        let receivedPassword: string | undefined;

        const hashAdapter: HashAdapterPort = {
            execute: async (password: string) => {
                receivedPassword = password;
                return "hashed!@Password123";
            },
        };

        const savedCompany = CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "hashed!@Password123"
        );

        const companyRepository: CompanyRepositoryPort = {
            findById: async () => null,
            save: async () => savedCompany,
        };

        const useCase = new CreateCompanyUseCase(companyRepository, hashAdapter);

        const result = await useCase.execute({
            companyName: "Empresa Teste",
            email: "email@teste.com",
            password: "Senha@123",
        });

        expect(receivedPassword).toBe("Senha@123");
        expect(result).toBe(savedCompany);
        expect(result.password).toBe("hashed!@Password123");
    });
});
