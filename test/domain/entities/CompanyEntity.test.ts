import CompanyEntity from "@domain/entities/CompanyEntity.js";
import InvalidEmailException from "@exceptions/InvalidEmailException.js";
import InvalidPasswordException from "@exceptions/InvalidPasswordException.js";

describe("CompanyEntity", () => {
    it("Deve criar uma intância de CompanyEntity com os valores fornecidos", () => {
        const companyEntity = CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "hashed!@Password123"
        );
        expect(companyEntity).toBeInstanceOf(CompanyEntity);
    });

    it("Deve retornar um erro caso o email fornecido seja inválido", () => {
        expect(() => CompanyEntity.create(
            "Empresa Teste",
            "emailteste.com",
            "hashed!@Password123"
        )).toThrow(InvalidEmailException);
    });

    it("Deve retornar um erro caso a senha fornecida seja inválida", () => {
        expect(() => CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "qw23123La"
        )).toThrow(InvalidPasswordException);
    });
})