import PasswordValueObject from "@domain/value-objects/PasswordValueObject.js";
import InvalidPasswordException from "@exceptions/InvalidPasswordException.js";

describe("PasswordValueObject", () => {
    it("Deve retornar um erro caso a senha seja inválida", () => {
        const invalidPassword = "123";
        expect(() => PasswordValueObject.create(invalidPassword)).toThrow(InvalidPasswordException);
    });

    it("Deve aceitar uma senha criptografada ao restaurar persistência", () => {
        const password = PasswordValueObject.restoreEncrypted("encrypted_password");

        expect(password.getValue()).toBe("encrypted_password");
        expect(password.isEncrypted()).toBe(true);
    });

    it("Deve rejeitar uma senha criptografada vazia", () => {
        expect(() => PasswordValueObject.restoreEncrypted("   ")).toThrow(InvalidPasswordException);
    });
})
