import EmailValueObject from "@domain/value-objects/EmailValueObject.js";
import InvalidEmailException from "@exceptions/InvalidEmailException.js";

describe("EmailValueObject", () => {
    it("Deve retornar um erro caso o email seja inválido", () => {
        const invalidEmail = "invalid-email";
        expect(() => EmailValueObject.create(invalidEmail)).toThrow(InvalidEmailException);
    });

    it("Deve normalizar espaços e letras maiúsculas do email", () => {
        const email = EmailValueObject.create("  Email@Teste.Com  ");
        expect(email.getValue()).toBe("email@teste.com");
    });
})
