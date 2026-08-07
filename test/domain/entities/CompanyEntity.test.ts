import CompanyEntity from "@domain/entities/CompanyEntity.js";
import InvalidEmailException from "@exceptions/InvalidEmailException.js";

describe("CompanyEntity", () => {
    it("Deve criar uma intância de CompanyEntity com os valores fornecidos", () => {
        const companyEntity = CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "hashedPassword123"
        );
        expect(companyEntity).toBeInstanceOf(CompanyEntity);
    })

    it("Deve retornar um erro caso o email fornecido seja inválido", () => {
        expect(() => CompanyEntity.create(
            "Empresa Teste",
            "emailteste.com",
            "hashedPassword123"
        )).toThrow("Email fornecido é inválido");
    })
})