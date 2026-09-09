import CompanyEntity from "@entities/CompanyEntity.js";
import InvalidEmailException from "@exceptions/InvalidEmailException.js";
import InvalidPasswordException from "@exceptions/InvalidPasswordException.js";

describe("CompanyEntity", () => {
    it("Deve criar uma intância de CompanyEntity com os valores fornecidos", () => {
        const companyEntity = CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "hashed!@Password123",
            "JBSWY3DPEBLW64TMMQQQ"
        );
        expect(companyEntity).toBeInstanceOf(CompanyEntity);
    });

    it("Deve retornar um erro caso o email fornecido seja inválido", () => {
        expect(() => CompanyEntity.create(
            "Empresa Teste",
            "emailteste.com",
            "hashed!@Password123",
            "JBSWY3DPEBLW64TMMQQQ"
        )).toThrow(InvalidEmailException);
    });

    it("Deve retornar um erro caso a senha fornecida seja inválida", () => {
        expect(() => CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "qw23123La",
            "JBSWY3DPEBLW64TMMQQQ"
        )).toThrow(InvalidPasswordException);
    });

    it("Deve permitir substituir a senha em texto por sua representação criptografada", () => {
        const companyEntity = CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "hashed!@Password123",
            "JBSWY3DPEBLW64TMMQQQ"
        );

        companyEntity.updatePassword("encrypted_password");

        expect(companyEntity.password).toBe("encrypted_password");
    });

    it("Deve atualizar o segredo TOTP para o valor criptografado", () => {
        const companyEntity = CompanyEntity.create(
            "Empresa Teste",
            "email@teste.com",
            "hashed!@Password123",
            "JBSWY3DPEBLW64TMMQQQ"
        );

        companyEntity.updateTotpSecret("encrypted_totp_secret");

        expect(companyEntity.totpSecret).toBe("encrypted_totp_secret");
    });
})
