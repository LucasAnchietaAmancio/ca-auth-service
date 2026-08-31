import EmailValueObject from "@domain/value-objects/EmailValueObject.js";
import InvalidEmailException from "@exceptions/InvalidEmailException.js";

describe("EmailValueObject", () => {
    it("Deve retornar um erro caso o email seja inválido", () => {
        const invalidEmail = "invalid-email";
        expect(() => EmailValueObject.create(invalidEmail)).toThrow(InvalidEmailException);
    })
})