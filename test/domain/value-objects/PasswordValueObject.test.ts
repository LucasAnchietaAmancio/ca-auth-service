import PasswordValueObject from "@domain/value-objects/PasswordValueObject.js";
import InvalidPasswordException from "@exceptions/InvalidPasswordException.js";

describe("PasswordValueObject", () => {
    it("Deve retornar um erro caso a senha seja inválida", () => {
        const invalidPassword = "123";
        expect(() => PasswordValueObject.create(invalidPassword)).toThrow(InvalidPasswordException);
    })
})